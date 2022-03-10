const debug = require('debug')('photo_app:album_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all albums
 *
 * GET /
 */

// password to all users: password_example

const index = async(req, res) => {

    await req.user.load('albums');

    res.send({
        status: 'success',
        data: req.user.related('albums'),

    });
}

/**
 * Get a specific album
 *
 * GET /:albumId
 */
const show = async(req, res) => {

    const album = await new models.Album({ id: req.params.albumId, user_id: req.user.id })
        .fetch({ require: false, withRelated: ['photos'] });

    // make sure album exists for his user
    if (!album) {
        debug("Album was not found.");
        res.status(404).send({
            status: 'fail',
            data: 'Album Not Found or access denied',
        });
        return;
    }

    res.send({
        status: 'success',
        data: {
            album
        }
    });
}

/**
 * Store a new album
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
        const album = await new models.Album(validData).save();
        debug("New album %o successfully created", album.id);

        res.send({
            status: 'success',
            data: album,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new album.',
        });
        throw error;
    }
}

/**
 * Update a specific album
 *
 * PUT /:albumId
 */
const update = async(req, res) => {

    const album = await new models.Album({ id: req.params.albumId, user_id: req.user.id }).fetch({ require: false });

    // make sure album exists for this user
    if (!album) {
        debug("Album to update was not found or user has no rights to update album.");
        res.status(404).send({
            status: 'fail',
            data: 'Album not found or access denied',
        });
        return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    const validData = matchedData(req);

    try {
        const updatedAlbum = await album.save(validData);
        debug("Album %O successfully updated", updatedAlbum.id);

        res.send({
            status: 'success',
            data: updatedAlbum,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when updating an album.',
        });
        throw error;
    }
}

const addPhoto = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    const album = await new models.Album({ id: req.params.albumId, user_id: req.user.id }).fetch({ require: false });

    // make sure album exists for this user
    if (!album) {
        debug("Album to update was not found.");
        res.status(404).send({
            status: 'fail',
            data: 'Album not found or access denied',
        });
        return;
    }

    await album.load('photos');
    const photos_in_album = album.related('photos')

    await req.user.load('photos');
    const users_photos = req.user.related('photos');

    const validData = matchedData(req);
    let check = false;

    // make sure photos are avialiable for this user

    validData.photo_id.forEach(async element => {
        const photo = users_photos.find(photo => photo.id == element);
        if (!photo) {
            check = true;
            return;
        }
    })

    if (check) {
        debug("User has no rights to attach one of these photos");
        res.status(403).send({
            status: 'fail',
            data: "Not permitted to attach these photos",
        });
        return;
    }

    // make sure this album does not already have these photos

    validData.photo_id.forEach(async element => {
        const photo = photos_in_album.find(photo => photo.id == element);
        if (photo) {
            check = true;
            return;
        }
    })

    if (check) {
        res.status(403).send({
            status: 'fail',
            data: 'One of the photos already exist in album',
        });
        return;
    }

    try {

        album.photos().attach(validData.photo_id);
        debug("New photos were succsessfully added to album");
        res.send({
            status: 'success',
            data: null,
        });

    } catch (err) {
        debug(err)
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when adding photos to an album.',
        });
        throw err;
    }

};

const deletePhoto = async(req, res) => {
    try {
        let album = await new models.Album({ id: req.params.albumId, user_id: req.user.id })
            .fetch({ require: false, withRelated: ['photos'] });
        if (!album) {
            debug("Album to update was not found.");
            res.status(404).send({
                status: 'fail',
                data: 'Album not found or access denied',
            });
            return;
        }

        let photo_in_album = album.related('photos').find(photo => req.params.photoId == photo.id);

        if (!photo_in_album) {
            res.status(403).send({
                status: 'fail',
                data: 'Photo was not found',
            });
            return;
        }

        album.photos().detach(req.params.photoId);

        return res.status(200).send({
            status: 'success',
            data: null
        });

    } catch (err) {
        return res.status(500).send({
            status: 'error',
            data: 'Exception thrown in database when deleting a photo from the album.',
        });
    }
}


/**
 * Destroy a specific album
 *
 * DELETE /:albumId
 */

const destroy = async(req, res) => {

    try {
        let album = await new models.Album({ id: req.params.albumId, user_id: req.user.id })
            .fetch({ require: false, withRelated: ['photos'] });
        if (!album) {
            debug("Album to update was not found or access denied.");
            res.status(404).send({
                status: 'fail',
                data: 'Album not found or access denied',
            });
            return;
        }

        album.photos().detach();

        album = await album.destroy();

        return res.status(200).send({
            status: 'success',
            data: null
        });

    } catch (err) {
        return res.status(500).send({
            status: 'error',
            data: 'Exception thrown in database when deleting an album.',
        });
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    addPhoto,
    deletePhoto,
    destroy
}