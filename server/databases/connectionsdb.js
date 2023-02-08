const mongoose = require('mongoose')
const Schema = mongoose.Schema

const connectionSchema = new Schema(
    {
        username: String,
        chatroom: String
    });

    //We use the following method to override _id from mongoose to regular id
    //This is done because our frontend requires id
    connectionSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });


module.exports = mongoose.model("connections", connectionSchema)