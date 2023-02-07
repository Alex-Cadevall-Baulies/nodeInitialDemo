const express = require('express');
const router = express.Router()

const playerClass = require('../helpers/player');


// GET return player list
router.get('/', async (req, res) => {
    try {
        const Player = new playerClass()
        const playerList = await Player.getPlayers()

        console.log(playerList)

        if (!playerList.length) {
            res.status(400).json({ message: 'No players registered yet!' })
        } else {
            res.status(200).json({ message: playerList })
        }
    } catch (err) { console.log(err), res.send(500) }
});


// POST create player
router.post('/', async (req, res) => {
    try {
        let newUsername = req.body.username

        if(!newUsername) {
            res.status(400).json({ message: `Username cannot be blank` })
            return
        }
        
        const Player = new playerClass(newUsername)
        const userConfirmation = await Player.createPlayer()

        if (userConfirmation) {
            res.status(200).json({ message: userConfirmation })
        } else {
            res.status(400).json({ message: `${newUsername} already registered` })
        }

    } catch (err) { console.log(err), res.send(500) }
});


// PUT modify player
router.put('/:id', async (req, res) => {
    try {
        let currentUsername = req.params.id
        const newUsername = req.body.username

        if(!newUsername) {
            res.status(400).json({ message: `Username cannot be blank` })
            return
        }

        const user = new playerClass(currentUsername)
        const changeUser = await user.modifyPlayer(newUsername)

        if (changeUser == `jugador registrat`) {
            res.status(400).json({ message: changeUser })
        } else if (changeUser) {
            res.status(200).json({ message: changeUser })
        } else {
            res.status(400).json({message: `ID ${req.params.id} no registrat`})
        }


    } catch (err) { console.log(err) }
})

//Other routes give error
router.get('*', function (res) {
    res.status(404).json({ message: 'route not found' });
});

module.exports = router