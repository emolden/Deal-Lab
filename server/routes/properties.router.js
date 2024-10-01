const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * GET properties
 */
router.get('/:id', (req, res) => {
  // GET route code here
});

/**
 * DELETE property
 */
router.delete('/:id', (req, res) => {
    // DELETE route code here
  });

/**
 * POST property
 */
router.post('/', (req, res) => {
  // POST route code here
});

/**
 * PUT property
 */
router.put('/', (req, res) => {
    // PUT  route code here
  });



  /**
 * GET property of interest
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