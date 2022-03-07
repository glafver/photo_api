const debug = require('debug')('photo_app:album_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all albums
 *
 * GET /
 */
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

    const album = await new models.Album({ id: req.params.albumId, user_id: req.user.id }).fetch({ require: false, withRelated: ['photos'] });

    // make sure album exists
    if (!album) {
        debug("Album was not found.");
        res.status(404).send({
            status: 'fail',
            data: 'Album Not Found',
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

    // make sure album exists
    const album = await new models.Album({ id: req.params.albumId, user_id: req.user.id }).fetch({ require: false });
    if (!album) {
        debug("Album to update was not found.");
        res.status(404).send({
            status: 'fail',
            data: 'Album Not Found',
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
            message: 'Exception thrown in database when updating a new album.',
        });
        throw error;
    }
}

const addPhoto = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    // make sure album exists for this user

    // await req.user.load('albums');
    // const albums = req.user.related('albums');
    // const album = albums.find(album => album.id == req.params.albumId);

    const album = await new models.Album({ id: req.params.albumId, user_id: req.user.id }).fetch({ require: false });

    if (!album) {
        debug("Album to update was not found.");
        res.status(404).send({
            status: 'fail',
            data: 'Album Not Found',
        });
        return;
    }

    const validData = matchedData(req);
    debug(validData)

    // make sure photo exists for this user
    await req.user.load('photos');
    const photos = req.user.related('photos');
    const photo = photos.find(photo => photo.id == validData.photo_id);

    if (!photo) {
        debug("Photo to update was not found.");
        res.status(404).send({
            status: 'fail',
            data: 'Photo Not Found',
        });
        return;
    }

    // make sure this album does not already have this photo
    await album.load('photos');
    const photo_in_album = album.related('photos').find(photo => photo.id == validData.photo_id);
    if (photo_in_album) {
        return res.send({
            status: 'fail',
            data: 'Photo already exists in this album.',
        });
    }

    try {
        album.photos().attach(validData.photo_id);
        debug("A new photo was succsess fully added to album");

        res.send({
            status: 'success',
            data: null,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when adding a photo to an album.',
        });
        throw error;
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
            debug("Album to update was not found.");
            res.status(404).send({
                status: 'fail',
                data: 'Album Not Found',
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
    destroy
}