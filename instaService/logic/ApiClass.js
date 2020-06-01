const axios = require('axios')
const qs = require('querystring')
const UserModel = require("../../db/models/User");

class ApiCallLogic {
    constructor() {
        this.short_token = ''
        this.user_id = ''
        this.long_token = ''
        this.userData = {
            short_token: "",
            user_id: "",
            long_token: ""
        }
    }


    ExchangeShortTokenForLongToken = (short_token, user_id) => {
        axios.get(process.env.LONG_LIVED_TOKEN_URI, {
            params: {
                grant_type: 'ig_exchange_token',
                client_secret: process.env.CLIENT_ID,
                access_token: short_token
            }
        })
            .then(res => {
                UserModel.updateOne(
                    { 'instagram_data.user_id': user_id },
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

    PostExchangeCodeForToken = (authorization_code) => {
        axios({
            method: 'post',
            url: process.env.EXCHANGE_CODE_FOR_TOKEN_URI,
            data: qs.stringify({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.ClIENT_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: process.env.REDIRECT_URI,
                code: authorization_code
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        })
            // .then(res => {
            //     userData.short_token = res.data.access_token
            //     userData.insta_user_id = res.data.user_id
            //     userData.hello = res.data.hello
            //     UserModel.findOneAndUpdate(
            //         {},
            //         {
            //         insta_user_id: res.data.user_id,
            //         short_token: res.data.access_token,
            //         // long_token: "String",
            //         // long_type: "String",
            //         // long_expires_in: 123
            //     })
            //         .then(createdUser => {
            //             console.log(createdUser)
            //         })
            //     return userData
            // })
            .then(res => {
                userData.short_token = res.data.access_token
                userData.insta_user_id = res.data.user_id
                userData.hello = res.data.hello
                // console.log(data)
                this.ExchangeShortTokenForLongToken(res.short_token, res.insta_user_id)
            })
            .catch(err => console.log(err))

    }

    GetUserProfileData = () => {
        let constructedURL = `${process.env.USER_PROFILES_AND_MEDIA_URI}${userData.user_id}`
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
        axios.get(process.env.USER_MEDIA_URI, {
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