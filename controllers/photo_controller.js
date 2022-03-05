const debug = require('debug')('books:photo_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all photos
 *
 * GET /
 */
const index = async(req, res) => {
    const photos = await models.Photo.fetchAll();

    res.send({
        status: 'success',
        data: photos,
    });
}

/**
 * Get a specific photo
 *
 * GET /:photoId
 */
const show = async(req, res) => {
    const photo = await new models.Photo({ id: req.params.photoId })
        .fetch({ withRelated: ['albums'] });

    res.send({
        status: 'success',
        data: photo,
    });
}




module.exports = {
    index,
    show
}