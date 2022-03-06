const debug = require('debug')('photo_app:photo_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all photos
 *
 * GET /
 */
const index = async(req, res) => {
    await req.user.load('photos');

    res.send({
        status: 'success',
        data: {
            photos: req.user.related('photos'),
        },
    });
}

/**
 * Get a specific photo
 *
 * GET /:photoId
 */
const show = async(req, res) => {
    const photo = await new models.Photo({ id: req.params.photoId })
        .fetch();

    res.send({
        status: 'success',
        data: photo,
    });
}

/**
 * Store a new photo
 *
 * POST /
 */
const store = async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    const validData = matchedData(req);
    validData.user_id = req.user.id

    try {
        const photo = await new models.Photo(validData).save();
        debug("New photo %o successfully created", photo.id);

        res.send({
            status: 'success',
            data: photo,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new photo.',
        });
        throw error;
    }
}

/**
 * Update a specific resource
 *
 * PUT /:photoId
 */
const update = async(req, res) => {
    const photoId = req.params.photoId;

    // make sure photo exists
    const photo = await new models.photo({ id: photoId }).fetch({ require: false });
    if (!photo) {
        debug("photo to update was not found. %o", { id: photoId });
        res.status(404).send({
            status: 'fail',
            data: 'photo Not Found',
        });
        return;
    }

    // check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    // get only the validated data from the request
    const validData = matchedData(req);

    try {
        const updatedphoto = await photo.save(validData);
        debug("Updated photo successfully: %O", updatedphoto);

        res.send({
            status: 'success',
            data: photo,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when updating a new photo.',
        });
        throw error;
    }
}

/**
 * Destroy a specific resource
 *
 * DELETE /:photoId
 */
const destroy = (req, res) => {
    res.status(400).send({
        status: 'fail',
        message: 'You need to write the code for deleting this resource yourself.',
    });
}


module.exports = {
    index,
    show,
    store,
    update,
    destroy,
}