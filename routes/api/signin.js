const User = require('../../models/user.js')
const UserSession = require('../../models/userSession.js')
const Songs = require('../../models/songs.js')


module.exports = (app) => {

    app.post('/api/account/signup', (req, res, next) => {
        var { body } = req;
        var { 
            username,
            password 
        } = body;

        if (!username) {
            res.end({
                success: false,
                message: 'Error - missing username'
            })
        }
        if (!password) {
            res.end({
                success: false,
                message: 'Error - invalid password'
            })
        }
        console.log("HERE IS YOUR BODY!")
        console.log(body)
        username = username.toLowerCase()

        User.find({
            username: username
        }, (error, previousUsers) => {
            if (error){
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                })    
            } else if (previousUsers.length > 0) {
                return res.send({
                    success: false,
                    message: 'Error: Username already exists'
                })
            }
            
            const newUser = new User()
            newUser.username = username
            newUser.password = newUser.generateHash(password)
            newUser.save((error, user) => {
                if (error){
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    })    
                } else if (previousUsers.length == 0) {
                    return res.send({
                        success: true,
                        message: 'Signup Successful!'
                    })
                } else { 
                        console.log("something went wrong...") 
                        console.log("Previous Users and length: ")    
                        console.log(previousUsers, previousUsers.length)}
            })

        }
        
        
        )

    })

    app.post('/api/account/signin', (req, res, next) => {
        console.log(req.body)
        var { body } = req;
        var { 
            username,
            password 
        } = body;

        if (!username) {
            res.end({
                success: false,
                message: 'Error - missing username'
            })
        }
        if (!password) {
            res.end({
                success: false,
                message: 'Error - invalid password'
            })
        }

        username = username.toLowerCase()

        User.find({
            username: username
        }, (error, users) => {
            if (error) {
                return res.send({
                    success: false,
                    message: 'error: server error2'
                })
            }
            if (users.length != 1) {
                console.log(req)
                return res.send({
                    success: false,
                    message: 'error: invalid1'
                })
            }
            const user = users[0]
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'error: invalid2'
                })
            }

            userSession = new UserSession()
            userSession.userId = user._id
            userSession.usernameRef = user._id
            userSession.username = user.username
            userSession.save((error, document) => {
                if (error) {
                    return res.send({
                        success: false,
                        message: 'error: server error1'
                    })
                }
                return res.send ({
                    success: true,
                    message: 'Sign In Success!',
                    token: document._id
                })
            })
        })

    })

    app.get('/api/account/verify', (req, res, next) => {
        const { query } = req
        const { token } = query

        UserSession.find({
            _id: token,
            isDeleted: false
        }).populate({path : 'usernameRef', populate : {path : 'songRef'}})
        .then(function(data){
            console.log("here is your data:  ")
            console.log(data[0].usernameRef.songRef)
            res.json(
                {
                success: true,
                userId: data[0].userId,
                username: data[0].username,
                message: 'Token Verified - go home',
                songs: data[0].usernameRef.songRef
                }
            )
        })
        .catch(function(data){
                return res.send({
                    success: false,
                    message: data
                })
        })
    })
        
        /*
        , (error, sessions) => {
            if (error) {
                return res.send({
                    success: false,
                    message: 'error: invalid token - redirect to signin page'
                })
            }
            if (sessions.length !=1){
                return res.send({
                    success: false,
                    message: 'error: session invalid - redirect to login page'
                })
            }
            else {
                console.log('here is session data')
                console.log(sessions)
                return res.json({
                    success: true,
                    userId: sessions[0].userId,
                    username: sessions[0].username,
                    message: 'Token Verified - go home'
                })
            }
        })
    }) */

    app.get('/api/account/logout', (req, res, next) => {
        console.log("req coming in")
        console.log(req.query.token)
        UserSession.findOneAndUpdate({
            _id: req.query.token,
            isDeleted: false
        }, {
            $set: {
                isDeleted: true
            }}, 
            null, (error, sessions) => {
            if (error) {
                return res.send({
                    success: false,
                    message: 'error: invalid token - redirect to signin page'
                })
            }
            else {
                return res.send({
                    success: true,
                    message: 'Token marked as deleted! - redirect to login page'
                })
            }
        })
    })

    app.post('/api/song/create', (req, res, next) => {

        const newSong = new Songs()
            newSong.songId = "BlahblahID"
            newSong.songJSONString = "TestString12e3"
            console.log("You created a song!")
            newSong.save(function(error, song){
                res.send({
                    success: true,
                    message: 'did the thing...'
                })
                User.findOneAndUpdate({ username: "testuser123" }, 
                   {$push:  { songRef: song._id }}, 
                    null, (error, sessions) => {
                    if (error) {
                        return res.send({
                            success: false,
                            message: error
                        })
                    }}
                    )
            })
        })


    app.post('/api/test/return', (req, res, next) => {
        User.findOne({ username: "testuser123"}).populate('songRef').then(function(data){
            res.send(data)
        })
    })

    app.post('/api/test/return2', (req, res, next) => {
        UserSession.findOne({ username: "testuser123"}).populate({path : 'usernameRef', populate : {path : 'songRef'}})
        .then(function(data){
            res.send(data)
        })
    })
}