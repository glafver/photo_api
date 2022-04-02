const debug = require('debug')('photo_app:auth_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


/**
 * Register a new user
 *
 * POST /
 */

const register = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    const validData = matchedData(req);

    try {
        validData.password = await bcrypt.hash(validData.password, models.User.hashSaltRounds);

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when hashing the password.',
        });
        throw error;
    }

    try {
        const user = await new models.User(validData).save();
        debug("New user successfully created");

        res.status(200).send({
            status: 'success',
            data: user,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new user.',
        });
        throw error;
    }
}

/**
 * Login a user, sign a JWT token and return it
 *
 * POST /login
 */
const login = async(req, res) => {
    const { email, password } = req.body;

    const user = await models.User.login(email, password);
    if (!user) {
        return res.status(401).send({
            status: 'fail',
            data: 'Authentication failed when login.',
        });
    }

    const payload = {
        email: user.get('email'),
        id: user.get('id'),
    }

    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
    });

    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '2h',
    });

    return res.send({
        status: 'success',
        data: {
            access_token,
            refresh_token,
        }
    });
}

/**
 * Validate refresh token and issue a new access token
 *
 * POST /refresh
 */
const refresh = (req, res) => {

    if (!req.headers.authorization) {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed 1',
        });
    }

    const [authSchema, token] = req.headers.authorization.split(' ');

    if (authSchema.toLowerCase() !== "bearer") {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed 2',
        });
    }

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        delete payload.iat;
        delete payload.exp;

        const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h',
        });

        return res.send({
            status: 'success',
            data: {
                access_token,
            }
        });

    } catch (error) {
        return res.status(401).send({
            status: 'fail',
            data: 'Invalid token',
        });
    }

}

module.exports = {
    register,
    login,
    refresh
}