const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
const authMiddleware = require('../middlewares/authentication');

router.get("/", authMiddleware, groupsController.getGroups);

module.exports = router;
