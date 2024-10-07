const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const axios = require('axios');

// ===================== Properties =====================
/**
 * ----- GET properties: getProperties
 */
router.get('/:id', async (req, res) => {
  console.log('in get properties/id: ', req.params.id);
  const userId = req.params.id;

  let connection;
  try{

    connection = await pool.connect()
    await connection.query('BEGIN;')

    const propertiesText = `
        SELECT * FROM "properties"
            WHERE "user_id" = $1
            ORDER BY "inserted_at" DESC;
    `;
    const propertiesResult = await connection.query(propertiesText, [userId])
    const properties = propertiesResult.rows

    const repairText = `
      SELECT 
        "properties"."id" AS "id",
        "repair_items"."id" AS "repair_id",
        "repair_items"."name" AS "repair_name",
        "repair_items"."cost" AS "repair_cost"
        FROM "properties"
        JOIN "repair_items"
          ON "properties"."id" = "repair_items"."property_id"
        WHERE "user_id" = $1
        ORDER BY "inserted_at" DESC;
    `;
    const repairResult = await connection.query(repairText, [userId])
    const repairItems = repairResult.rows

    const holdingText = `
      SELECT
        "properties"."id" AS "id",
        "holding_items"."id" AS "holding_id",
        "holding_items"."name" AS "holding_name",
        "holding_items"."cost" AS "holding_cost" 
        FROM "properties"
        JOIN "holding_items"
          ON "properties"."id" = "holding_items"."property_id"
        WHERE "user_id" = $1
        ORDER BY "inserted_at" DESC;
    `;
    const holdingResult = await connection.query(holdingText, [userId])
    const holdingItems = holdingResult.rows

    const propertyInfo = {
      properties: properties,
      repairItems: repairItems,
      holdingItems: holdingItems
    }

    await connection.query('Commit;')
    res.send(propertyInfo);
    
  }catch(err) {
    console.log('GET properties failed: ', err);
    await connection.query('Rollback;')
    res.sendStatus(500);
  } finally {
    await connection.release()
  }
});


/**
 * ----- POST property: addProperty
 */
router.post('/', async (req, res) => {
  const api_key = process.env.RENTCAST_API_KEY;
  const address = req.body.address;
  const userId = req.user.id;
  let propertyApiId;
  let listingResponse = {};
  let recordsResponse = {};
  let valueEstimateResponse = {};
  let taxYear;
  console.log('ADDRESS:', address, userId);
  
  let connection;
  try {
    connection = await pool.connect()
    await connection.query('BEGIN;')

    const checkTimeStampSqlText = `
        SELECT * FROM "property_api_data"
            WHERE "inserted_at" >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
            AND "address" = $1;
    `
    const checkTimeStampResults = await pool.query(checkTimeStampSqlText, [address]);
    const checkTimeStampData = checkTimeStampResults.rows;
    console.log('checkTimeStampData is:', checkTimeStampData);
    


    if (checkTimeStampData.length === 0) {
      // ================ Axios for VALUE ESTIMATE (afterRepairValue)
      const theValueEstimateResponse = await axios({
        method: 'GET',
        url: `https://api.rentcast.io/v1/avm/value?address=${address}&limit=1&compCount=5`,
        headers: {
            'accept': 'application/json',
            'X-Api-Key': `${api_key}`
        }
      })
      valueEstimateResponse = theValueEstimateResponse;
      console.log("Data from valueEstimateResponse:", valueEstimateResponse.data);



      // ================ Axios for RECORDS (taxesYearly)
      const theRecordsResponse = await axios({
        method: 'GET',
        url: `https://api.rentcast.io/v1/properties?address=${address}&limit=1`,
        headers: {
            'accept': 'application/json',
            'X-Api-Key': `${api_key}`
        }
      })
      recordsResponse = theRecordsResponse;
      console.log("Data from recordsResponse:", recordsResponse.data);


      // ================ Axios for LISTING
      const newFormattedAddress = recordsResponse.data[0].formattedAddress;

      try {
        const theListingResponse = await axios({
          method: 'GET',
          url: `https://api.rentcast.io/v1/listings/sale?address=${newFormattedAddress}&limit=1`,
          headers: {
              'accept': 'application/json',
              'X-Api-Key': `${api_key}`
          }
        })
        listingResponse = theListingResponse;

      } catch(error) {
        console.log('Address cannot be found in listing.');

        listingResponse = {data: [{
          formattedAddress: newFormattedAddress,
          price: valueEstimateResponse.data.price,
          propertyType: (recordsResponse.data[0].propertyType ? recordsResponse.data[0].propertyType : 'Single Family'),
          bedrooms: (recordsResponse.data[0].bedrooms ? recordsResponse.data[0].bedrooms : 3),
          bathrooms: (recordsResponse.data[0].bathrooms ? recordsResponse.data[0].bathrooms : 2),
          squareFootage: (recordsResponse.data[0].squareFootage ? recordsResponse.data[0].squareFootage : 1500)
        }]}
      }
      console.log("Data from listingResponse:", listingResponse.data);



      // ================ SQL insert into table: PROPERTY_API_DATA
      const lastYear = new Date().getFullYear() - 1;
      taxYear = recordsResponse.data[0].propertyTaxes;
      
      if (!taxYear) {
          taxYear = null;
      } else if (taxYear) {
          taxYear = recordsResponse.data[0].propertyTaxes[`${lastYear}`].total;
      }
          
      const propertyApiData = [
          listingResponse.data[0].formattedAddress,
          listingResponse.data[0].price,
          taxYear,
          valueEstimateResponse.data.priceRangeHigh,
          listingResponse.data[0].propertyType,
          listingResponse.data[0].bedrooms,
          listingResponse.data[0].bathrooms,
          listingResponse.data[0].squareFootage
      ]

      const propertyApiDataSqlText = `
          INSERT INTO "property_api_data"
          ("address", "purchase_price", "taxes_yearly", "after_repair_value", 
          "property_type", "bedrooms", "bathrooms", "square_footage")
          VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING "id";
      `
      const propertyApiDataResults = await pool.query(propertyApiDataSqlText, propertyApiData);
      propertyApiId = propertyApiDataResults.rows[0].id;

    } else if (checkTimeStampData.length > 0) {

      console.log('Property already exists in database!');
      propertyApiId = checkTimeStampData[0].id;
    }



    // ================ SQL insert into table: PROPERTIES
    const propertiesData = [
        userId,
        propertyApiId,
        listingResponse.data[0].formattedAddress,
        listingResponse.data[0].price,
        taxYear,
        valueEstimateResponse.data.priceRangeHigh
    ]

    const propertiesSqlText = `
      INSERT INTO "properties"
        ("user_id", "property_api_id", "address", "purchase_price", "taxes_yearly", "after_repair_value")
        VALUES
        ($1, $2, $3, $4, $5, $6) RETURNING id;
    `;
    const propertiesResults = await pool.query(propertiesSqlText, propertiesData);
    const propertyId = propertiesResults.rows[0].id



    // ================ SQL insert into table: HOLDING
    const getDefaultHoldingsText = `
      SELECT * FROM "default_holdings"
        WHERE "user_id" = $1;
    `;
    const getDefaultHoldingsResults = await pool.query(getDefaultHoldingsText, [userId]);
    console.log('getDefaultHoldingsResult: ', getDefaultHoldingsResults.rows)

    for(let holdingItem of getDefaultHoldingsResults.rows) {
      const addHoldingItemText = `
        INSERT INTO "holding_items"
          ("property_id", "name", "cost")
          VALUES
          ($1, $2, $3);
      `;
      const addHoldingItemValues = [propertyId, holdingItem.holding_name, holdingItem.holding_cost];
      const addHoldingItemResults = await pool.query(addHoldingItemText, addHoldingItemValues);
    }



    // ================ SQL insert into table: REPAIR
    const getDefaultRepairsText = `
    SELECT * FROM "default_repairs"
      WHERE "user_id" = $1;
    `;
    const getDefaultRepairsResults = await pool.query(getDefaultRepairsText, [userId]);
    console.log('getDefaultRepairsResult: ', getDefaultRepairsResults.rows)

    for(let repairItem of getDefaultRepairsResults.rows) {
      const addRepairItemText = `
        INSERT INTO "repair_items"
          ("property_id", "name", "cost")
          VALUES
          ($1, $2, $3);
      `;
      const addRepairItemValues = [propertyId, repairItem.repair_name, repairItem.repair_cost];
      const addRepairItemResults = await pool.query(addRepairItemText, addRepairItemValues);
    }


    console.log('Property posted/updated in database!');
    
    await connection.query('Commit;')
    res.sendStatus(201)

  } catch(err) {
      console.log('Add property failed: ', err);
      await connection.query('Rollback;')
      res.sendStatus(500);
  } finally {
    await connection.release()
  }
});


/**
 * ----- DELETE property: deleteProperty
 */
router.delete('/:id', (req, res) => {
    // console.log('/api/properties/id delete route received a request! ', req.params.id)
    const propertyId = req.params.id;

    const sqlText = `
      DELETE FROM "properties"
	      WHERE "id" = $1;
    `
  
      pool.query(sqlText, [propertyId])
      .then((results) => {
          res.send(results.rows);
      }) .catch((error) => {
          console.log('Error in deleting property:', error);
          res.sendStatus(500);
      })
  });


/**
 * ----- PUT property: updateProperty
 */
router.put('/', (req, res) => {
       console.log('/api/properties put route received a request! ', req.body)
      //  const propertyId = req.params.id;

      //  const sqlText = `
      //    DELETE FROM "properties"
      //      WHERE "id" = $1;
      //  `
     
      //    pool.query(sqlText, [propertyId])
      //    .then((results) => {
      //        res.send(results.rows);
      //    }) .catch((error) => {
      //        console.log('Error in deleting property:', error);
      //        res.sendStatus(500);
      //    })
  });


  /**
 * ----- GET property of interest: getPropertyOfInterest
 */
router.get('/propertyOfInterest/:id', rejectUnauthenticated, async (req, res) => {
  // console.log('in the /api/properties/propertyOfInterest/id route: ', req.params.id);  
  
  let connection;
  try {

    connection = await pool.connect()
    await connection.query('BEGIN;')

    const propertyId = req.params.id;
    

    //requests specific property info from the properties table
    const propertyText = `
      SELECT * FROM "properties"
	      WHERE "properties"."id" = $1;
    `;
    const propertyValue = [propertyId]
    const propertyResult = await connection.query(propertyText, propertyValue);
    // console.log('database reponse to property: ', propertyResult.rows)


    //request repair items for specific property
    const repairItemText = `
      SELECT 
        "repair_items"."id" AS "repair_items_id",
        "properties"."id" AS "property_id",
        "repair_items"."name" AS "repair_name",
        "repair_items"."cost" AS "repair_cost" 
        FROM "properties"
        JOIN "repair_items"
          ON "properties"."id" = "repair_items"."property_id"
        WHERE "properties"."id" = $1;
    `;
    const repairItemValue = [propertyId]
    const repairItemResult = await connection.query(repairItemText, repairItemValue);
    // console.log('database reponse to repairItem: ', repairItemResult.rows)

   
      //request holding items for specific property
      const holdingItemText = `
        SELECT 
          "holding_items"."id" AS "holding_items_id",
          "properties"."id" AS "property_id",
          "holding_items"."name" AS "holding_name",
          "holding_items"."cost" AS "holding_cost" 
          FROM "properties"
          JOIN "holding_items"
            ON "properties"."id" = "holding_items"."property_id"
          WHERE "properties"."id" = $1;
    `;
    const holdingItemValue = [propertyId]
    const holdingItemResult = await connection.query(holdingItemText, holdingItemValue);
    // console.log('database reponse to holdingItem: ', holdingItemResult.rows)


    await connection.query('COMMIT;')

    const propertyData = {
      property : propertyResult.rows,
      repairItems : repairItemResult.rows,
      holdingItems : holdingItemResult.rows
    }

    res.send(propertyData)
  } catch (error) {
    console.log('error in /api/properties/propertyOfInterest/id GET route: ', error)
    await connection.query('ROLLBACK;')
    res.sendStatus(500);
  } finally {
    await connection.release()
  }

});


  /**
 * ----- PUT back to default: updateBackToDefault
 */
router.put('/backToDefault/:id', async (req, res) => {
  console.log('params.id:', req.params.id);
  const propertyId = req.params.id;
  const userId = req.user.id;
  const connection = await pool.connect()
  const api_key = process.env.RENTCAST_API_KEY;
  let propertyApiId;
  let formattedAddress;
  let purchasePrice;
  let afterRepairValue;
  let listingResponse = {};
  let recordsResponse = {};
  let valueEstimateResponse = {};
  let taxYear;
  let address;

  try {
    await connection.query('BEGIN;')

    // ================ SQL delete holding items
    const deleteHoldingItemsSqlText = `
      DELETE FROM "holding_items"
        WHERE "property_id" = $1;
    `
    const deleteHoldingItemsResponse = await pool.query(deleteHoldingItemsSqlText, [propertyId])



    // ================ SQL delete repair items
    const deleteRepairItemsSqlText = `
      DELETE FROM "repair_items"
        WHERE "property_id" = $1;
    `
    const deleteRepairItemsResponse = await pool.query(deleteRepairItemsSqlText, [propertyId])



    // ================ SQL get address
    const getAddressSqlText = `
      SELECT address FROM "properties"
        WHERE "id" = $1;
    `
    const getAddressResponse = await pool.query(getAddressSqlText, [propertyId])
    address = getAddressResponse.rows[0].address;



    // ========================== RECALLING API && CHECKING TIMESTAMP ==========================
    const checkTimeStampSqlText = `
        SELECT * FROM "property_api_data"
            WHERE "inserted_at" >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
            AND "address" = $1;
    `
    const checkTimeStampResults = await pool.query(checkTimeStampSqlText, [address]);
    const checkTimeStampData = checkTimeStampResults.rows;
    console.log('checkTimeStampData is:', checkTimeStampData);
      
  
  
    if (checkTimeStampData.length === 0) {
      // ================ Axios for VALUE ESTIMATE (afterRepairValue)
      const theValueEstimateResponse = await axios({
        method: 'GET',
        url: `https://api.rentcast.io/v1/avm/value?address=${address}&limit=1&compCount=5`,
        headers: {
            'accept': 'application/json',
            'X-Api-Key': `${api_key}`
        }
      })
      valueEstimateResponse = theValueEstimateResponse;
      purchasePrice = valueEstimateResponse.data.price;
      afterRepairValue = valueEstimateResponse.data.priceRangeHigh;
      console.log("Data from valueEstimateResponse:", valueEstimateResponse.data);



      // ================ Axios for RECORDS (taxesYearly)
      const theRecordsResponse = await axios({
        method: 'GET',
        url: `https://api.rentcast.io/v1/properties?address=${address}&limit=1`,
        headers: {
            'accept': 'application/json',
            'X-Api-Key': `${api_key}`
        }
      })
      recordsResponse = theRecordsResponse;
      console.log("Data from recordsResponse:", recordsResponse.data);


      // ================ Axios for LISTING
      formattedAddress = recordsResponse.data[0].formattedAddress;

      try {
        const theListingResponse = await axios({
          method: 'GET',
          url: `https://api.rentcast.io/v1/listings/sale?address=${formattedAddress}&limit=1`,
          headers: {
              'accept': 'application/json',
              'X-Api-Key': `${api_key}`
          }
        })
        listingResponse = theListingResponse;

      } catch(error) {
        console.log('Address cannot be found in listing.');

        listingResponse = {data: [{
          formattedAddress: formattedAddress,
          price: purchasePrice,
          propertyType: (recordsResponse.data[0].propertyType ? recordsResponse.data[0].propertyType : 'Single Family'),
          bedrooms: (recordsResponse.data[0].bedrooms ? recordsResponse.data[0].bedrooms : 3),
          bathrooms: (recordsResponse.data[0].bathrooms ? recordsResponse.data[0].bathrooms : 2),
          squareFootage: (recordsResponse.data[0].squareFootage ? recordsResponse.data[0].squareFootage : 1500)
        }]}
      }
      console.log("Data from listingResponse:", listingResponse.data);



      // ================ SQL insert into table: PROPERTY_API_DATA
      const lastYear = new Date().getFullYear() - 1;
      taxYear = recordsResponse.data[0].propertyTaxes;
      
      if (!taxYear) {
          taxYear = null;
      } else if (taxYear) {
          taxYear = recordsResponse.data[0].propertyTaxes[`${lastYear}`].total;
      }
          
      const propertyApiData = [
          listingResponse.data[0].formattedAddress,
          listingResponse.data[0].price,
          taxYear,
          valueEstimateResponse.data.priceRangeHigh,
          listingResponse.data[0].propertyType,
          listingResponse.data[0].bedrooms,
          listingResponse.data[0].bathrooms,
          listingResponse.data[0].squareFootage
      ]

      const propertyApiDataSqlText = `
          INSERT INTO "property_api_data"
          ("address", "purchase_price", "taxes_yearly", "after_repair_value", 
          "property_type", "bedrooms", "bathrooms", "square_footage")
          VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING "id";
      `
      const propertyApiDataResults = await pool.query(propertyApiDataSqlText, propertyApiData);
      propertyApiId = propertyApiDataResults.rows[0].id;

    } else if (checkTimeStampData.length > 0) {
      console.log('Property already exists in database!');
      const mostRecentCheck = checkTimeStampData.length - 1;

      propertyApiId = checkTimeStampData[mostRecentCheck].id;
      formattedAddress = checkTimeStampData[mostRecentCheck].address;
      purchasePrice = checkTimeStampData[mostRecentCheck].purchase_price;
      afterRepairValue = checkTimeStampData[mostRecentCheck].after_repair_value;
      
    }



    // ================ SQL insert into table: PROPERTIES
    const propertiesData = [
        userId,
        propertyApiId,
        formattedAddress,
        purchasePrice,
        taxYear,
        afterRepairValue
    ]

    const propertiesSqlText = `
      INSERT INTO "properties"
        ("user_id", "property_api_id", "address", "purchase_price", "taxes_yearly", "after_repair_value")
        VALUES
        ($1, $2, $3, $4, $5, $6) RETURNING id;
    `;
    const propertiesResults = await pool.query(propertiesSqlText, propertiesData);



    // ================ SQL insert into table: HOLDING
    const getDefaultHoldingsText = `
      SELECT * FROM "default_holdings"
        WHERE "user_id" = $1;
    `;
    const getDefaultHoldingsResults = await pool.query(getDefaultHoldingsText, [userId]);
    console.log('getDefaultHoldingsResult: ', getDefaultHoldingsResults.rows)

    for(let holdingItem of getDefaultHoldingsResults.rows) {
      const addHoldingItemText = `
        INSERT INTO "holding_items"
          ("property_id", "name", "cost")
          VALUES
          ($1, $2, $3);
      `;
      const addHoldingItemValues = [propertyId, holdingItem.holding_name, holdingItem.holding_cost];
      const addHoldingItemResults = await pool.query(addHoldingItemText, addHoldingItemValues);
    }



    // ================ SQL insert into table: REPAIR
    const getDefaultRepairsText = `
    SELECT * FROM "default_repairs"
      WHERE "user_id" = $1;
    `;
    const getDefaultRepairsResults = await pool.query(getDefaultRepairsText, [userId]);
    console.log('getDefaultRepairsResult: ', getDefaultRepairsResults.rows)

    for(let repairItem of getDefaultRepairsResults.rows) {
      const addRepairItemText = `
        INSERT INTO "repair_items"
          ("property_id", "name", "cost")
          VALUES
          ($1, $2, $3);
      `;
      const addRepairItemValues = [propertyId, repairItem.repair_name, repairItem.repair_cost];
      const addRepairItemResults = await pool.query(addRepairItemText, addRepairItemValues);
    }

    
    await connection.query('Commit;');
    console.log('Back to default done and API calls updated');
    res.sendStatus(200)


    // ========================== IF NOT CALLING API, SEND THIS ==========================
    // res.send({address: addressResult, userId: userId});

  } catch (error) {
    console.log('Update back to default failed:', error);
    await connection.query('Rollback;')
    res.sendStatus(500);
  } finally {
    await connection.release()
  }
})

// ===================== Repair Item =====================
/**
 * DELETE property repair item
 */
router.delete('/repairItem/:id', (req, res) => {
  const itemId = req.params.id;

  const sqlText = `
    DELETE FROM "repair_items"
      WHERE "id" = $1;
  `; 
  pool.query(sqlText, [itemId])

      .then((results) => {
        res.sendStatus(201)
      }) 
      .catch((error) => {
        console.log('Error in deleting property repair item:', error);
        res.sendStatus(500);
      })
});


/**
 * POST property repair item
 */
router.post('/repairItem/', (req, res) => {
  const propertyId = req.body.propertyId;
  const repairName = req.body.repairName;
  const repairCost = req.body.repairCost;

  const sqlText = `
    INSERT INTO "repair_items"
      ("property_id", "name", "cost")
      VALUES
      ($1, $2, $3);
  `; 
  pool.query(sqlText, [propertyId, repairName, repairCost])

      .then((results) => {
        res.sendStatus(201)
      }) 
      .catch((error) => {
        console.log('Error in adding property repair item:', error);
        res.sendStatus(500);
      })
});




// ===================== Holding Item =====================
/**
 * DELETE property holding item
 */
router.delete('/holdingItem/:id', (req, res) => {
  const itemId = req.params.id;

  const sqlText = `
    DELETE FROM "holding_items"
      WHERE "id" = $1;
  `; 
  pool.query(sqlText, [itemId])

      .then((results) => {
        res.sendStatus(201)
      }) 
      .catch((error) => {
        console.log('Error in deleting property holding item:', error);
        res.sendStatus(500);
      })
});


/**
 * POST property holding item
 */
router.post('/holdingItem', (req, res) => {
  const propertyId = req.body.propertyId;
  const holdingName = req.body.holdingName;
  const holdingCost = req.body.holdingCost;

  const sqlText = `
    INSERT INTO "holding_items"
      ("property_id", "name", "cost")
      VALUES
      ($1, $2, $3);
  `; 
  pool.query(sqlText, [propertyId, holdingName, holdingCost])

      .then((results) => {
        res.sendStatus(201)
      }) 
      .catch((error) => {
        console.log('Error in adding property holding item:', error);
        res.sendStatus(500);
      })
});

router.put('/taxes', (req, res) => {
  const propertyId = req.body.propertyId;

  const sqlText = `
    UPDATE "properties"
      SET "taxes_yearly" = 0
      WHERE "id" = $1;
  `; 
  pool.query(sqlText, [propertyId])

      .then((results) => {
        res.sendStatus(201)
      }) 
      .catch((error) => {
        console.log('Error in updating property taxes:', error);
        res.sendStatus(500);
      })
});





module.exports = router;