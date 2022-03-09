const debug = require('debug')('photo_app:photo_controller');
const { matchedData, validationResult } = require('express-validator');
const { Photo } = require('../models');
const models = require('../models');

/**
 * Get all photos
 *
 * GET /
 */

// password to all users: password_example

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

    const photo = await new models.Photo({ id: req.params.photoId, user_id: req.user.id })
        .fetch({ require: false });

    // make sure photo exists
    if (!photo) {
        debug("Photo was not found.");
        res.status(404).send({
            status: 'fail',
            data: 'Photo not found or access denied',
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

    // make sure photo exists
    const photo = await new models.Photo({ id: req.params.photoId, user_id: req.user.id })
        .fetch({ require: false });
    if (!photo) {
        debug("Photo to update was not found.");
        res.status(404).send({
            status: 'fail',
            data: 'Photo not found or access denied',
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

/**
 * Destroy a specific resource
 *
 * DELETE /:photoId
 */

const destroy = async(req, res) => {

    try {
        let photo = await new models.Photo({ id: req.params.photoId, user_id: req.user.id })
            .fetch({ require: false, withRelated: ['albums'] });
        if (!photo) {
            debug("Photo to update was not found.");
            res.status(404).send({
                status: 'fail',
                data: 'Photo not found or access denied',
            });
            return;
        }

        photo.albums().detach();

        photo = await photo.destroy();

        return res.status(200).send({
            status: 'success',
            data: null
        });

    } catch (err) {
        debug(err)
        return res.status(500).send({
            status: 'error',
            data: 'Exception thrown in database when deleting a photo.',
        });
    }
}


module.exports = {
    index,
    show,
    store,
    update,
    destroy
}