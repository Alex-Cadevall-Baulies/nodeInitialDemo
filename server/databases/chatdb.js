module.exports = mongoose => { 
    const schema = new mongoose.Schema(
    {
        _id: Number,
        user: String,
        chatroom: String,
        message: String,
    },
    { 
        timestamps: false 
    });

    //We use the following method to override _id from mongoose to regular id
    //This is done because our frontend requires id
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });

    const chat = mongoose.model("chat", schema)
    return chat
}