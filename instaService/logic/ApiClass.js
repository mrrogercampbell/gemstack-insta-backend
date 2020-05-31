const axios = require('axios')
const qs = require('querystring')
const { CLIENT_ID, REDIRECT_URI, ClIENT_SECRET } = process.env
const mongoose = require("../Models/UserModel");
const UserModel = mongoose.model('UserModel')

class ApiCallLogic {
    constructor() {
        this.short_token = ''
        this.user_id = ''
        this.long_token = ''
        this.ExchangeCodeForTokenURL = 'https://api.instagram.com/oauth/access_token/'
        this.UserMediaURL = 'https://graph.instagram.com/me/media'
        this.AccessTokenURL = 'http://localhost:4001/oauth/access_token'
        this.ShortForLongTokenURL = 'https://graph.instagram.com/access_token'
        this.UserProfileDataURL = 'https://graph.instagram.com/'
        this.userData = {
            short_token: "",
            user_id: "",
            long_token: ""
        }
    }


    ExchangeShortTokenForLongToken = (short_token, user_id) => {
        axios.get(this.AccessTokenURL, {
            params: {
                grant_type: 'ig_exchange_token',
                client_secret: CLIENT_ID,
                access_token: short_token
            }
        })
            .then(res => {
                UserModel.updateOne(
                    { insta_user_id: user_id },
                    {
                        $set: {
                            long_token: res.data.access_token,
                            long_type: res.data.token_type,
                            long_expires_in: res.data.expires_in
                        }
                    }
                )
                    .then(updatedUser => console.log(updatedUser))
                    .catch(err => console.log(err))
            })
    }

    PostExchangeCodeForToken = (url, client_id, client_secret, redirect_uri, authorization_code) => {
        axios({
            method: 'post',
            url: url,
            data: qs.stringify({
                client_id: client_id,
                client_secret: client_secret,
                grant_type: 'authorization_code',
                redirect_uri: redirect_uri,
                code: authorization_code
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })
            .then(res => {
                userData.short_token = res.data.access_token
                userData.insta_user_id = res.data.user_id
                userData.hello = res.data.hello
                UserModel.create({
                    insta_user_id: res.data.user_id,
                    short_token: res.data.access_token,
                    // long_token: "String",
                    // long_type: "String",
                    // long_expires_in: 123
                })
                    .then(createdUser => {
                        console.log(createdUser)
                    })
                return userData
            })
            .then(data => {
                // console.log(data)
                this.ExchangeShortTokenForLongToken(data.short_token, data.insta_user_id)
            })
            .catch(err => console.log(err))

    }

    GetUserProfileData = () => {
        let constructedURL = `${this.UserProfileDataURL}${userData.user_id}`
        axios.get(constructedURL, {
            params: {
                fields: 'account_type, id, media_count, username',
                access_token: userData.long_token
            }
        })
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
            .finally(this.ExchangeShortTokenForLongToken())
    }

    GetMediaData = () => {
        axios.get(this.UserMediaURL, {
            params: {
                user_id: 0,
                fields: 'id, media_type, media_url, permalink, thumbnail_url, timestamp, caption, username',
                access_token: userData.long_token
            }
        })
            .then(res => console.log(res.data))
            .catch(err => console.log(err))
    }
}

module.exports = { ApiCallLogic }