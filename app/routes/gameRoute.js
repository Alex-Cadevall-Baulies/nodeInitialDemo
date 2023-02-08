const express = require('express');
const router = express.Router()

const {postThrows, deleteThrows, getThrows} = require('../controllers/throwController')

router
    .route('/:id')
    .post(postThrows)
    .delete(deleteThrows)
    .get(getThrows)

//Other routes give error
router.get('*', (req, res) => {
    res.status(404).json({ message: 'route not found' });
});

module.exports = router