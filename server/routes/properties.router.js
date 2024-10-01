const express = require('express');
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
router.get('/propertyOfInterest/:id', (req, res) => {
  console.log('in the /api/properties/propertyOfInterest/id route: ', req.params.id);  
    // GET route code here
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