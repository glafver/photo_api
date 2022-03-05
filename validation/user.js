const { body } = require('express-validator');
const models = require('../models');

const createRules = [
    body('email').exists().isString().trim().isEmail().custom(async value => {
        const user = await new models.User({ email: value }).fetch({ require: false });
        if (user) {
            return Promise.reject("User with this e-mail already exists.");
        }

        return Promise.resolve();
    }),
    body('password').exists().isString().trim().isLength({ min: 6 }),
    body('first_name').exists().isString().trim().isLength({ min: 3 }),
    body('last_name').exists().isString().trim().isLength({ min: 3 }),
];

module.exports = { createRules };