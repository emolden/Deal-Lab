const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', async (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const defaultHoldingPeriod = 6;
  const defaultRepairItemName = 'Miscellaneous';
  const defaultRepairItemCost = 20000;
  const defaultHoldingItemName = 'Utilities';
  const defaultHoldingItemCost = 200;

  let connection;
  try {

    connection = await pool.connect()
    await connection.query('BEGIN;')

    //inserts a new user in the user table
    const newUserText = `
      INSERT INTO "user" 
        (username, password, holding_period_default)
        VALUES 
        ($1, $2, $3) RETURNING id;
    `;
    const newUserResult = await connection.query(newUserText, [username, password, defaultHoldingPeriod])
    console.log(newUserResult.rows) 
    const userId = newUserResult.rows[0].id

    const repairDefaultText = `
      INSERT INTO "default_repairs"
        (user_id, repair_name, repair_cost)
        VALUES
        ($1, $2, $3)
    `;
    const repairDefaultValues = [userId, defaultRepairItemName, defaultRepairItemCost]
    const repairDefaultResult = await connection.query(repairDefaultText, repairDefaultValues)

    await connection.query('Commit;')
    res.sendStatus(201)

  } catch(err) {
      console.log('User registration failed: ', err);
      await connection.query('Rollback;')
      res.sendStatus(500);
    } finally {
      await connection.release()
    }
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user
  req.logout((err) => {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
});

module.exports = router;
