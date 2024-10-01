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
router.get('/:id', (req, res) => {
  console.log('in get properties/id: ', req.params.id);
  const userId = req.params.id;

  const sqlText = `
      SELECT * FROM "properties"
          WHERE "user_id" = $1
          ORDER BY "inserted_at" DESC;
  `

    pool.query(sqlText, [userId])
    .then((results) => {
        res.send(results.rows);
    }) .catch((error) => {
        console.log('Error in getting properties:', error);
        res.sendStatus(500);
    })
});


/**
 * ----- POST property: addProperty
 */
router.post('/', async (req, res) => {
  const api_key = process.env.RENTCAST_API_KEY;
  const address = req.body.address;
  const userId = req.user.id;
  console.log('ADDRESS:', address, userId);
  

  try {
      const checkTimeStampSqlText = `
          SELECT * FROM "property_api_data"
              WHERE "inserted_at" >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
              AND "address" = $1
              AND "user_id" = $2;
      `
      const checkTimeStampResults = await pool.query(checkTimeStampSqlText, [address, userId]);
      const checkTimeStampData = checkTimeStampResults.rows;
      
      if (checkTimeStampData.length === 0) {
          // ================ Axios for LISTING
          const listingResponse = await axios({
              method: 'GET',
              url: `https://api.rentcast.io/v1/listings/sale?address=${address}&limit=1`,
              headers: {
                  'accept': 'application/json',
                  'X-Api-Key': `${api_key}`
              }
          })
          console.log("Data from listingResponse:", listingResponse.data);
          


          // ================ Axios for RECORDS (taxesYearly)
          const recordsResponse = await axios({
              method: 'GET',
              url: `https://api.rentcast.io/v1/properties?address=${address}&limit=1`,
              headers: {
                  'accept': 'application/json',
                  'X-Api-Key': `${api_key}`
              }
          })
          console.log("Data from recordsResponse:", recordsResponse.data);



          // ================ Axios for VALUE ESTIMATE (afterRepairValue)
          const valueEstimateResponse = await axios({
              method: 'GET',
              url: `https://api.rentcast.io/v1/avm/value?address=${address}&limit=1&compCount=5`,
              headers: {
                  'accept': 'application/json',
                  'X-Api-Key': `${api_key}`
              }
          })
          console.log("Data from valueEstimateResponse:", valueEstimateResponse.data);



          // ================ SQL insert into table: PROPERTY_API_DATA
          const lastYear = new Date().getFullYear() - 1;
          let taxYear = recordsResponse.data[0].propertyTaxes;
          
          if (!taxYear) {
              taxYear = null;
          } else if (taxYear) {
              taxYear = recordsResponse.data[0].propertyTaxes[`${lastYear}`].total;
          }
              
          const propertyApiData = [
              userId,
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
              ("user_id", "address", "purchase_price", "taxes_yearly", "after_repair_value", 
              "property_type", "bedrooms", "bathrooms", "square_footage")
              VALUES
              ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              RETURNING "id";
          `
          const propertyApiDataResults = await pool.query(propertyApiDataSqlText, propertyApiData);
          const propertyApiId = propertyApiDataResults.rows[0].id;
      


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
          ($1, $2, $3, $4, $5, $6);
          `
          const propertiesResults = await pool.query(propertiesSqlText, propertiesData);

          console.log('Property posted/updated in database!');
          res.sendStatus(201);

      } else if (checkTimeStampData.length > 0) {

          console.log('Property already exists in database!');
          res.sendStatus(201);

      }
  } catch (error) {
      console.log('Error in getting API data:', error);
      res.sendStatus(500);
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
    // PUT  route code here
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



// ===================== Repair Item =====================
/**
 * DELETE property repair item
 */
router.delete('/repairItem/:id', (req, res) => {
    // DELETE route code here
});


/**
 * POST property repair item
 */
router.post('/repairItem/:id', (req, res) => {
    // POST route code here
});



// ===================== Holding Item =====================
/**
 * DELETE property holding item
 */
router.delete('/holdingItem/:id', (req, res) => {
    // DELETE route code here
});


/**
 * POST property holding item
 */
router.post('/holdingItem/:id', (req, res) => {
    // POST route code here
});



module.exports = router;