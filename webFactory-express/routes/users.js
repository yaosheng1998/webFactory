const express = require('express');
const router = express.Router();
const userDb = require('../db/users');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  const allUsers = await userDb.getAllUsers();
  res.send(allUsers);
});

module.exports = router;
