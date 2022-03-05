const debug = require('debug')('photo_app:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');
const bcrypt = require('bcrypt');

/**
 * Get all users
 *
 * GET /
 */
const index = async(req, res) => {
    const users = await models.User.fetchAll();

    res.send({
        status: 'success',
        data: users,
    });
}

/**
 * Get a specific user
 *
 * GET /:userId
 */
const show = async(req, res) => {
    const user = await new models.User({ id: req.params.userId })
        .fetch({ withRelated: ['albums', 'photos'] });

    res.send({
        status: 'success',
        data: user,
    });
}

/**
 * Register a new user
 *
 * POST /
 */

const register = async(req, res) => {
    // check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    // get only the validated data from the request
    const validData = matchedData(req);

    // generate a hash of `validData.password` and overwrite `validData.password` with the generated hash
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



module.exports = {
    index,
    show,
    register
}