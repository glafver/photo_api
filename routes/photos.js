const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');


router.get('/', photoController.index);

router.get('/:photoId', photoController.show);


module.exports = router;