const mongoose = require('mongoose');

//schema
const subscriptionSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    articleId: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Export Subscription Model
const Subscription = mongoose.model('subscription', subscriptionSchema);

// Helper function
Subscription.get = function (callback, limit) {
    Subscription.find(callback).limit(limit);
};

// Subscribe current user to specific article
Subscription.subscribeTo = function(req, res) {
    const subscription = new Subscription();
    subscription.userId = req.user._id;
    subscription.articleId = req.params.article_id;

    //Save and check error
    subscription.save(function (err, data) {
        if (err)
            return res.json(err);

        res.json({
            message: "New Subscription Added!",
            data
        });
    });
};

// Get all user subscriptions (returns articleIds)
Subscription.getAllByUserId = async function (user) {
    return Subscription.find({
        'userId': user._id
    }, ['articleId']);
};

module.exports = Subscription;
