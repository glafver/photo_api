const { body } = require('express-validator');
const models = require('../models');

// title string required must be at least 3 chars long
// url string required must be a url
// comment string must be at least 3 chars long

const createRules = [
    body('title').exists().isString().trim().isLength({ min: 3 }),
    body('url').exists().isURL().trim().isLength({ min: 3 }),
    body('comment').optional().isString().trim().isLength({ min: 3 }),
];

module.exports = { createRules };