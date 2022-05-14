const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//schema
const articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    private: {
        type: Boolean,
        default: false
    },
    authorId: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Export Article Model
const Article = mongoose.model('article', articleSchema);

// Helper search function
Article.get = function (callback, limit) {
    Article.find(callback).sort([['created_at', 'descending']]).limit(limit)
};

// Get all articles (for editors)
Article.getAll = function (req, res) {
    Article.get(function (err, data) {
        if (err)
            return res.json({
                status: "error",
                message: err
            });
        res.json({
            status: "success",
            message: "All articles",
            data
        });
    });
}

// Get Public articles for anonymous users
Article.getPublicArticles = function (req, res) {
    Article.find({
        'private': false
    }, function (err, data) {
        if (err) {
            return res.json({
                status: "error",
                message: err
            });
        }
        res.json({
            status: "success",
            message: "Public articles",
            data
        });
    }).sort([['created_at', 'descending']]);
}

Article.getPrivateArticles = function (req, res) {
    Article.find({
        $and: [{'_id': {$nin: req.subscriptions.map((it) => it.articleId)}}, {'private': true}]
    }, ['_id', 'title'], function (err, data) {
        if (err) {
            return res.json({
                status: "error",
                message: err
            });
        }
        res.json({
            status: "success",
            message: "Private articles",
            data
        });
    }).sort([['created_at', 'descending']])
};

// Get specific article by id
Article.getById = function (req, res) {
    Article.findById(req.params.article_id, function (err, data) {
        if (err)
            return res.send(err);
        res.json({
            message: 'Article Details',
            data
        });
    });
};

// Get user subscriptions & public articles (for auth-users only)
Article.getUserArticles = function (ids) {
    return Article
        .find({$or: [{'_id': {$in: ids.map(it => it.articleId)}}, {'private': false}]})
        .sort([['created_at', 'descending']])
};

// Add new article (editors only)
Article.add = async function (req, res) {
    const article = new Article();
    article.title = req.body.title;
    article.description = req.body.description;
    article.authorId = req.user._id;
    article.private = req.body.private || false;

    //Save and check error
    article.save(function (err, data) {
        if (err)
            return res.json(err);

        res.json({
            message: "New Article Added!",
            data
        });
    });
};

// Update article (editors only)
Article.updateArticle = function (req, res) {
    Article.findById(req.params.article_id, function (err, article) {
        if (err)
            return res.send(err);
        article.title = req.body.title ? req.body.title : article.title;
        article.description = req.body.description ? req.body.description : article.description;

        //save and check errors
        article.save(function (err) {
            if (err)
                return res.json(err);
            res.json({
                message: "Article Updated Successfully",
                data: article
            });
        });
    });
};

module.exports = Article;
