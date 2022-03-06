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
        data: {
            albums: req.user.related('albums'),
        },
    });
}

/**
 * Get a specific album
 *
 * GET /:albumId
 */
const show = async(req, res) => {
    await req.user.load('albums');
    const album = await new models.Album({ id: req.params.albumId })
        .fetch({ withRelated: ['photos'] });


    debug(album)
    debug(album.title)
    res.send({
        status: 'success',
        data: album,
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
 * Update a specific resource
 *
 * PUT /:albumId
 */
// const update = async(req, res) => {
//     const albumId = req.params.albumId;

//     // make sure album exists
//     const album = await new models.album({ id: albumId }).fetch({ require: false });
//     if (!album) {
//         debug("album to update was not found. %o", { id: albumId });
//         res.status(404).send({
//             status: 'fail',
//             data: 'album Not Found',
//         });
//         return;
//     }

//     // check for any validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(422).send({ status: 'fail', data: errors.array() });
//     }

//     // get only the validated data from the request
//     const validData = matchedData(req);

//     try {
//         const updatedalbum = await album.save(validData);
//         debug("Updated album successfully: %O", updatedalbum);

//         res.send({
//             status: 'success',
//             data: album,
//         });

//     } catch (error) {
//         res.status(500).send({
//             status: 'error',
//             message: 'Exception thrown in database when updating a new album.',
//         });
//         throw error;
//     }
// }

/**
 * Destroy a specific resource
 *
 * DELETE /:albumId
 */
// const destroy = (req, res) => {
//     res.status(400).send({
//         status: 'fail',
//         message: 'You need to write the code for deleting this resource yourself.',
//     });
// }

module.exports = {
    index,
    show,
    store,
    // update,
    // destroy,
}