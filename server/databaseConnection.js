//We require mongoose and connect database
const mongoose = require("mongoose")
mongoose.set("strictQuery", false);
//database address on .env in main folder
mongoose.connect(process.env.DATABASE_CONNECTION, {useNewUrlParser: true})
const db = mongoose.connection

db.on('error', (error) => console.log(error))
db.once('open', () => console.log(`database connected`))