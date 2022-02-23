const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentication');
const userExistsMiddleware = require('../middlewares/userExists');

router.post("/subscribe", authController.subscribe);
router.post("/login", userExistsMiddleware, authController.login);

module.exports = router;
