const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');


router.get('/', albumController.index);

router.get('/:albumId', albumController.show);

// router.post('/', albumValidationRules.createRules, albumController.store);

// router.put('/:albumId', albumValidationRules.updateRules, albumController.update);

// router.delete('/:albumId', albumController.destroy);


module.exports = router;