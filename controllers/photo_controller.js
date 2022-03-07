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
        data: req.user.related('photos'),

    });
}

/**
 * Get a specific photo
 *
 * GET /:photoId
 */
const show = async(req, res) => {

    // make sure photo exists and it belongs to the user

    const photo = await new models.Photo({ id: req.params.photoId, user_id: req.user.id }).fetch({ require: false });

    if (!photo) {
        debug("Photo was not found.");
        res.status(404).send({
            status: 'fail',
            data: 'Photo Not Found',
        });
        return;
    }

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

    // make sure photo exists and it belongs to the user
    const photo = await new models.Photo({ id: req.params.photoId, user_id: req.user.id }).fetch({ require: false });
    if (!photo) {
        debug("Photo to update was not found.");
        res.status(404).send({
            status: 'fail',
            data: 'Photo Not Found',
        });
        return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    const validData = matchedData(req);

    try {
        const updatedPhoto = await photo.save(validData);
        debug("Photo %O successfully updated", updatedPhoto.id);

        res.send({
            status: 'success',
            data: updatedPhoto,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when updating a photo.',
        });
        throw error;
    }
}


module.exports = {
    index,
    show,
    store,
    update,
}