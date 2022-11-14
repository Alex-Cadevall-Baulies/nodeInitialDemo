const express = require('express');
const router = express.Router()

const playerClass = require('../helpers/player');
const Player = new playerClass()

// GET return player list
router.get('/', async (req, res) => {
    try {
        const playerList = await Player.getPlayers()

        res.status(200)
        res.json(playerList)
    } catch (err) { console.log(err), res.send(500) }
});


// POST create player
router.post('/', async (req, res) => {
    try {
        let newUsername = req.body.username
        const userConfirmation = await Player.createPlayer(newUsername)
        
        res.status(200)
        res.send(userConfirmation)

    } catch (err) { console.log(err), res.send(500)}
});

/*
// PUT modify player
router.put('/:id', async (req, res) => {
    try {
        let currentUsername = req.params.id
        const newUsername = req.body.username
        console.log(currentUsername, newUsername)

        const user = new playerClass(currentUsername)
        const changeUser = await user.modifyPlayer(newUsername)
        
        res.send(changeUser)

    } catch (err) { console.log(err) }
});*/

module.exports = router