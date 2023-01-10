function tokenAuthenticate(req, res, next) {
    // We request the authorization and split it to get only the token
    const authHeader = req.headers['authorization']
    //If we have authHeader then return the portion splited. if there is not return undefined
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(404)
    
    jwt.verify(usernameCheck, process.env.ACCESS_TOKEN_SECRET,(err, usernameCheck) => {
        //If client has token but not valid
        if(err) return res.sendStatus(403)
        req.user = usernameCheck.username
        next()
    })
}

module.exports = tokenAuthenticate