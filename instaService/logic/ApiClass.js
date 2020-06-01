const axios = require('axios')
const qs = require('querystring')
const UserModel = require("../../db/models/User");

class ApiCallLogic {
    constructor() {
        this.userData = {
            short_token: '',
            user_id: '',
            long_token: '',
            expires_in: 0,
            username: ''
        }
    }


    ExchangeShortTokenForLongToken = () => {
        axios.get(process.env.LONG_LIVED_TOKEN_URI, {
            params: {
                grant_type: 'ig_exchange_token',
                client_secret: process.env.CLIENT_ID,
                access_token: this.userData.short_token
            }
        })
            .then(res => {
                this.userData.long_token = res.access_token
                this.userData.expires_in = res.expires_in
                this.GetUserProfileData()
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
            .then(res => {
                this.userData.short_token = res.access_token
                this.userData.user_id = res.user_id
                this.ExchangeShortTokenForLongToken()
            })
            .catch(err => console.log(err))

    }

    GetUserProfileData = () => {
        let constructedURL = `${process.env.USER_PROFILES_AND_MEDIA_URI}${this.userData.user_id}`
        axios.get(constructedURL, {
            params: {
                fields: 'account_type, id, media_count, username',
                access_token: userData.long_token
            }
        })
            .then(res => {
                this.userData.username = res.username
                UserModel.findOneAndUpdate(
                    { 'instagram_data.username': this.userData.username },
                    {
                        $set: {
                            'instagram_data.tokens.short_token.token': this.userData.short_token,
                            'instagram_data.tokens.long_token.token': this.userData.long_token,
                            'instagram_data.tokens.long_token.expires_in': this.userData.expires_in,
                            'instagram_data.user_id': this.userData.user_id,

                        }
                    },
                    { new: true }
                )
                    .then(updatedRecord => console.log(updatedRecord))
            })
            .catch(err => console.log(err))
        // .finally(this.ExchangeShortTokenForLongToken())
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