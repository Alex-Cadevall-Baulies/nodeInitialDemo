const playerClass = require('../helpers/player');

const getPlayers = async (req, res) => {
    try {
        const Player = new playerClass()
        const playerList = await Player.getPlayers()

        if (!playerList.length) {
            res.status(400).json({ message: 'No players registered yet!' })
        } else {
            res.status(200).json({ message: playerList })
        }
    } catch (err) { console.log(err), res.send(500) }
}

const postPlayer = async (req, res) => {
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
}

const putPlayer = async (req, res) => {
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
}

module.exports = {getPlayers, postPlayer, putPlayer}