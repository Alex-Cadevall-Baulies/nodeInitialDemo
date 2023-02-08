const player = require('../helpers/player');
const throws = require('../helpers/throws');
const NewThrow = new throws()

const postThrows = async (req, res) => {
    let userID = req.params.id

    let user = new player(userID)
    const checkUser = await user.checkPlayerID()

    if (checkUser) {
        let addThrow = await NewThrow.registerThrows(userID)
    if (addThrow.total === 7) {
            await user.registerWin()

            res.status(201).json({message: `Total de la tirada ${addThrow.total}. Victoria registrada!`})
        } else if (addThrow.total !== 7) {
            await user.registerLoses()

            res.status(201).json({message: `Total de la tirada ${addThrow.total}. Partida registrada, torna-ho a intentar!`})
        }
    } else {
        res.status(400).json({message: `Jugador amb ID ${userID} no trobat, registre't per jugar!`})
    }
}

const deleteThrows = async (req, res) => {
    let playerID = req.params.id
    let deleteThrows = await NewThrow.destroyRows(playerID)

    res.status(200).json(deleteThrows)

}

const getThrows = async (req, res) => {
    let playerID = req.params.id
    let throwList = await NewThrow.getThrows(playerID)
    
    if(!throwList.length) {
        res.status(400).json({message: 'Usuari sense tirades'})
    } else {
        res.status(200).json({message: throwList})
    }
    
} 

module.exports = {postThrows, deleteThrows, getThrows}