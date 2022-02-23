const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const authMiddleware = require('../middlewares/authentication');

router.get("/users", authMiddleware, usersController.getUsers);

module.exports = router;
