const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");

router.post("/subscribe",  usersController.subscribe);

module.exports = router;
