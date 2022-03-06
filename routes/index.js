const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');
const userValidationRules = require('../validation/user')
const auth = require('../middlewares/auth');

router.get('/', (req, res) => {
    res.send({ status: 'success' });
});

router.use('/albums', auth.basic, require('./albums'));
router.use('/photos', auth.basic, require('./photos'));

router.post('/register', userValidationRules.createRules, authController.register);

module.exports = router;