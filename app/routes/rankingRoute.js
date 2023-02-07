const express = require('express');
const router = express.Router()

const playerClass = require('../helpers/player');
const players = new playerClass("")

// GET ranking organized by individual and average success %
router.get('/', async (req, res) => {
    let playerList = await players.orderPlayers()

    if (!playerList.length) {
        res.status(400).json({ message: 'Cap jugador registrat' })
    } else {
        res.status(200).json({ message: playerList })
    }

})
// GET loser player with less success %
router.get('/loser', async (req, res) => {
    let playerLoser = await players.getLoser()

    if (!playerLoser) {
        res.status(400).json({ message: 'Cap jugador registrat' })
    } else {
        res.status(200).json({ message: playerLoser })
    }
})

// GET winner player with most success %
router.get('/winner', async (req, res) => {
    let playerWinner = await players.getWinner()

    if (!playerWinner) {
        res.status(400).json({ message: 'Cap jugador registrat' })
    } else {
        res.status(200).json({ message: playerWinner })
    }
})

//Other routes give error
router.get('*', (req, res) => {
    res.status(404).json({ message: 'route not found' });
});

module.exports = router