const express = require('express');
const router = express.Router()

const {getRanking, getLoser, getWinner} = require('../controllers/rankingController')

router.get('/', getRanking)
router.get('/loser', getLoser)
router.get('/winner', getWinner)

//Other routes give error
router.get('*', (req, res) => {
    res.status(404).json({ message: 'route not found' });
});

module.exports = router