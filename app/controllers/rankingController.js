const playerClass = require('../helpers/player');
const players = new playerClass("")

const getRanking = async (req, res) => {
    let playerList = await players.orderPlayers()

    if (!playerList.length) {
        res.status(400).json({ message: 'Cap jugador registrat' })
    } else {
        res.status(200).json({ message: playerList })
    }

}

const getLoser = async (req, res) => {
    let playerLoser = await players.getLoser()

    if (!playerLoser) {
        res.status(400).json({ message: 'Cap jugador registrat' })
    } else {
        res.status(200).json({ message: playerLoser })
    }
}

const getWinner = async (req, res) => {
    let playerWinner = await players.getWinner()

    if (!playerWinner) {
        res.status(400).json({ message: 'Cap jugador registrat' })
    } else {
        res.status(200).json({ message: playerWinner })
    }
}

module.exports = {getRanking, getLoser, getWinner}