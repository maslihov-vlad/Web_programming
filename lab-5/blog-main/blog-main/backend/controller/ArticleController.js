const {authenticateJWT, getUserId, isEditor} = require("../utils");

const router = require('express').Router();

const articleController = require('../models/Article');
const subscriptionsController = require('../models/Subscription');

// Only authorized users + editors can create articles
router.post('/article', authenticateJWT, isEditor, async (req, res) => {
    await articleController.add(req, res);
});

// Get private articles ids for subscription
router.get('/articles/private', authenticateJWT, getUserSubscriptions, async (req, res) => {
    await articleController.getPrivateArticles(req, res);
});


// Only authorized users + editors can edit articles
router.post('/article/:article_id', authenticateJWT, isEditor, async (req, res) => {
    await articleController.updateArticle(req, res);
});

// Editors can access all articles
router.get('/articles', async (req, res) => {
    let user = {role: 'user'};
    try {
        user = getUserId(req);
    } catch (e) {
        // user is not authorized
    }

    switch (user.role) {
        case "editor": {
            await articleController.getAll(req, res);
            break;
        }
        case "subscriber": {
            const articleIds = await subscriptionsController.getAllByUserId(getUserId(req));
            const articles = await articleController.getUserArticles(articleIds);

            await res.json({
                message: "Subscriber & Public Articles",
                data: articles
            });
            break;
        } case "user": {
            await articleController.getPublicArticles(req, res)
        }
    }
});

async function getUserSubscriptions(req, res, next) {
    req.subscriptions = await subscriptionsController.getAllByUserId(req.user);
    next();
}

module.exports = router;
