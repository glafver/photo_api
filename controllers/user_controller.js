const debug = require('debug')('books:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

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

module.exports = {
    index,
    show
}