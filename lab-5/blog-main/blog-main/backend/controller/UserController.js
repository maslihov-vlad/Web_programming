const {authenticateJWT} = require('../utils');

const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userController = require('../models/User');

// Register a subscriber
router.post('/register', async (req, res) => {
    let user;
    try {
        user = await userController.add(req, res);
    } catch (e) {
        return res.send(e);
    }

    // Return accessToken and keep it in localStorage
    const accessToken = jwt.sign(JSON.stringify(user), `${process.env.TOKEN_SECRET}`);

    await res.json({
        accessToken
    });
});

// Get user profile using accessToken
router.get('/auth/me', authenticateJWT, async (req, res) => {
    await userController.getMe(req, res);
});

/**
 * https://dev.to/eidorianavi/authentication-and-jwt-in-node-js-4i13
 */
// Login and return JWT
router.post('/login', async (req, res) => {
    const user = await userController.findOne({login: req.body.login});

    try {
        const match = await bcrypt.compare(req.body.password, user.password);
        const accessToken = jwt.sign(JSON.stringify(user), `${process.env.TOKEN_SECRET}`);
        if (match) {
            await res.json({accessToken: accessToken});
        } else {
            await res.json({message: "Invalid Credentials"});
        }
    } catch (e) {
        console.log(e)
        res.sendStatus(401);
    }
});

module.exports = router;
