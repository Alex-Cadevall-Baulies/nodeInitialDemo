const express = require('express');
const router = express.Router()

const {getPlayers, postPlayer, putPlayer} = require('../controllers/playerController')

router.get('/', getPlayers);
router.post('/', postPlayer);
router.put('/:id', putPlayer)

//Other routes give error
router.get('*', (req, res) => {
    res.status(404).json({ message: 'route not found' });
});

module.exports = router