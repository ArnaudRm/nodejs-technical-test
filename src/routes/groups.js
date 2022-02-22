const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
const authMiddleware = require('../middlewares/authentication');

router.get("/", authMiddleware, groupsController.getGroups);
router.post("/", authMiddleware, groupsController.createGroup);
router.post("/:groupId/invite", authMiddleware, groupsController.inviteToGroup);
router.get("/latest", authMiddleware, groupsController.getLatestGroup);

module.exports = router;
