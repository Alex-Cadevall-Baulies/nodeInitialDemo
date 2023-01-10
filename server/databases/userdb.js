const mongoose = require('mongoose')
const Schema = mongoose.Schema

    const UserSchema = new Schema(
    {
        _id: Number,
        username: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        chatRooms: [
            'main'
        ]
    });

    //We use the following method to override _id from mongoose to regular id
    //This is done because our frontend requires id
    UserSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        //we use the following method to hide password and avoid vulnerabilities
        //delete object.password;
        return object;
      });
module.exports = mongoose.model("user", UserSchema)