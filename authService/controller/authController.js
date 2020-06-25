const User = require('../../db/models/User')
const axios = require('axios')

module.exports = {
    createUser: async (req, res) => {
        // Create a new user
        try {
            const userData = {
                fName: req.body.fName,
                lName: req.body.lName,
                email: req.body.email,
                password: req.body.password,
                instagram_data: {
                    username: req.body.username
                }
            }

            const user = new User(userData)
            await user.save()
            // await console.log("done" + user)
            const token = await user.generateAuthToken()
            res.status(201).send({ user, token })
        } catch (error) {
            res.status(420).send(error)
            console.log(error)
        }
    },

    userLogin: async (req, res) => {
        //Login a registered user
        try {
            const { email, password } = req.body
            const user = await User.findByCredentials(email, password)
            if (!user) {
                return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
            }
            const token = await user.generateAuthToken()
            res.send({ user, token })
        } catch (error) {
            res.status(400).send(error)
        }

    },

    getData: async (req, res) => {
        const token = req.header('Authorization').replace('Bearer ', '')

        // let doc = User.findOne({ 'tokens.token': token })
        // console.log(doc.schema.tree.instagram_data.tokens.long_token.token)

        User.findOne({ 'tokens.token': token })
            .then(doc => {
                let instaToken = doc.instagram_data.tokens.long_token.token

                let URI = process.env.USER_MEDIA_URI
                let data = axios.get(URI, {
                    params: {
                        fields: 'id,media_type,media_url,permalink,thumbnail_url,timestamp,caption,username',
                        access_token: instaToken
                    }
                })
                return data
            })
            .then(userData => res.json(userData.data))
            .catch(err => console.log(err))
    },

    createToken: async (req, res) => {
        //Login a registered user
        try {
            const { token } = req.body
            // const user = await User.findByCredentials(email, password)
            const user = await User.find({
                "tokens.token": token
            })
            if (!user) {
                return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
            }
            // const token = await user.generateAuthToken()
            res.send({ user })
        } catch (error) {
            res.status(400).send(error)
        }

    },

    getUserProfile: async (req, res) => {
        // View logged in user profile
        res.send(req.user)
    },

    logOutSingleUserToken: async (req, res) => {
        // Log user out of the application
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token != req.token
            })
            await req.user.save()
            res.send()
        } catch (error) {
            res.status(500).send(error)
        }
    },

    logOutAllUserTokens: async (req, res) => {
        // Log user out of all devices
        try {
            req.user.tokens.splice(0, req.user.tokens.length)
            await req.user.save()
            res.send()
        } catch (error) {
            res.status(500).send(error)
        }
    }

}