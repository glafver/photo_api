const { body } = require('express-validator');
const models = require('../models');

// email string required must be a valid email and not already exist
// password string required must be at least 6 chars long
// first_name string required must be at least 3 chars long
// last_name string required must be at least 3 chars long

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