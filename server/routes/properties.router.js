const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const axios = require('axios');

// ===================== Properties =====================
/**
 * ----- GET properties: getProperties
 */
router.get('/:id', (req, res) => {
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
  console.log('ADDRESS:', address);
  

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
    // DELETE route code here
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
router.get('/propertyOfInterest/:id', (req, res) => {
    // GET route code here
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