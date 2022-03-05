const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({ status: 'success' });
});

router.use('/users', require('./users'));
router.use('/albums', require('./albums'));
router.use('/photos', require('./photos'));

module.exports = router;