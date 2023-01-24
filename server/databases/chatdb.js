const mongoose = require('mongoose')
const Schema = mongoose.Schema

    const chatSchema = new Schema(
    {
        username: String,
        chatroom: String,
        message: String
    });

    //We use the following method to override _id from mongoose to regular id
    //This is done because our frontend requires id
    chatSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });


module.exports = mongoose.model("chat", chatSchema)