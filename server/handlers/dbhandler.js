const mongoose = require("mongoose")
const User = require('../database/userdb')

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_USER, {useNewUrlParser: true})

async function connect() {
const db = await dbConnection

db.on('error', (error) => console.log(error))
db.once('open', () => console.log(`database connected`))
}

connect()

// async function run() {
//const user = await User.create({username: String, nickname: String, password: String,})
//to save that to db
//await user.save()
//console.log(`${user.username} saved`)
//}

module.exports = dbConnection