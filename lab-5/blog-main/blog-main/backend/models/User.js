const {getUserId} = require('../utils');

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//schema
const userSchema = mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "subscriber"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Export User Model
const User = mongoose.model('user', userSchema);

User.get = function (callback, limit) {
    User.find(callback).limit(limit);
};


User.getMe = function (req, res) {
    const userId = getUserId(req);
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    User.findById(userId, function (err, data) {
        if (err)
            res.send(err);
        res.json({
            message: 'User Details',
            data,
        });
    });
};

User.add = async function (req, res) {
    const user = new User();
    user.login = req.body.login;
    user.role = req.body.role || "subscriber";
    user.password = await bcrypt.hash(req.body.password, 10);

    //Save and check error
    await user.save();

    return user;
};

module.exports = User;
