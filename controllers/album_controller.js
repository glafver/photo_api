const debug = require('debug')('books:album_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all albums
 *
 * GET /
 */
const index = async(req, res) => {
    const albums = await models.Album.fetchAll();

    res.send({
        status: 'success',
        data: albums,
    });
}

/**
 * Get a specific album
 *
 * GET /:albumId
 */
const show = async(req, res) => {
    const album = await new models.Album({ id: req.params.albumId })
        .fetch({ withRelated: ['photos'] });

    res.send({
        status: 'success',
        data: album,
    });
}

module.exports = {
    index,
    show
}