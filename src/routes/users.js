const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const authMiddleware = require('../middlewares/authentication');

router.post("/subscribe",  usersController.subscribe);
router.post("/login",  usersController.login);
router.get("/users", authMiddleware, usersController.getUsers);

module.exports = router;
