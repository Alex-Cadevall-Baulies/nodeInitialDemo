module.exports = mongoose => { 
    const user = new mongoose.Schema(
    {
        _id: Number,
        username: String,
        nickname: String,
        password: String,
    },
    { 
        timestamps: false 
    });

    return user
}

module.exports = mongoose.model("User", user)