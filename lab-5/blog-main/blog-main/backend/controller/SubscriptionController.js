const {authenticateJWT, getUserId} = require("../utils");

const router = require('express').Router();
const subscriptionsController = require('../models/Subscription');

// Subscribe currently authorized user to specific article
router.get('/subscribe/:article_id', authenticateJWT, async (req, res) => {
    await subscriptionsController.subscribeTo(req, res);
});

module.exports = router;

