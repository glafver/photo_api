const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller');
const photoValidationRules = require('../validation/photo');


router.get('/', photoController.index);

router.get('/:photoId', photoController.show);

router.post('/', photoValidationRules.createRules, photoController.store);

router.put('/:photoId', photoValidationRules.updateRules, photoController.update);


module.exports = router;