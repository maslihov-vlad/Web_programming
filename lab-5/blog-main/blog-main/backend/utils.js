const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, `${process.env.TOKEN_SECRET}`, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

const getUserId = (req) => {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(': ')[1];

    return jwt.verify(token, `${process.env.TOKEN_SECRET}`);
};

const isEditor = (req, res, next) => {
    if (req.user.role === 'editor') {
        next();
    } else {
        res.sendStatus(403);
    }
};

module.exports = {
    getUserId,
    authenticateJWT,
    isEditor
};

