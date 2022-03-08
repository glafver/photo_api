const debug = require('debug')('photo_app:auth');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

const validateJwtToken = async(req, res, next) => {
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
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed 3',
        });
    }
    req.user = await new User({ id: req.user.id }).fetch();
    next();
}

module.exports = {
    validateJwtToken
}