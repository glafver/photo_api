const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');


router.get('/', albumController.index);

router.get('/:albumId', albumController.show);


module.exports = router;