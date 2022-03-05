const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const userValidationRules = require('../validation/user')

router.get('/', (req, res) => {
    res.send({ status: 'success' });
});

router.use('/users', require('./users'));
router.use('/albums', require('./albums'));
router.use('/photos', require('./photos'));

router.post('/register', userValidationRules.createRules, userController.register);

module.exports = router;