const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * PUT back to default
 */
router.put('/:userId/:propertyId', (req, res) => {
    // PUT route code here
  });


/**
 * GET defaults
 */
router.get('/', (req, res) => {
  // GET route code here
});

/**
 * PUT default holding period
 */
router.put('/', (req, res) => {
  // PUT route code here
});


/**
 * DELETE default repair item
 */
router.delete('/repairItem/:id', (req, res) => {
    // DELETE route code here
  });

  /**
 * POST default repair item
 */
router.post('/repairItem', (req, res) => {
    // POST route code here
  });



  /**
 * DELETE default holding item
 */
router.delete('/holdingItem/:id', (req, res) => {
    // DELETE route code here
  });

  /**
 * POST default holding item
 */
router.post('/holdingItem', (req, res) => {
    // POST route code here
  });

module.exports = router;