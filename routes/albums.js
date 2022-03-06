const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album');


router.get('/', albumController.index);

router.get('/:albumId', albumController.show);

router.post('/', albumValidationRules.albumValidationRules, albumController.store);

router.put('/:albumId', albumValidationRules.albumValidationRules, albumController.update);

// router.delete('/:albumId', albumController.destroy);


module.exports = router;