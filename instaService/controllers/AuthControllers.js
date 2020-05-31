const { PostExchangeCodeForToken, GetUserProfileData, ExchangeShortTokenForLongToken, GetMediaData } = require('../logic/ApiClass')
const { CLIENT_ID, REDIRECT_URI, ClIENT_SECRET } = process.env

const AccessTokenURL = 'http://localhost:4001/oauth/access_token'
const MeURL = 'http://localhost:4001/oauth/me'

const baseInstagramURI = 'https://api.instagram.com/oauth/access_token'
const herokuURI = 'https://rc1336-test-insta-api.herokuapp.com/auth'

// import { GetShortForLongToken, PostExchangeCodeForToken, GetUserProfileData, GetMediaData } from './ApiClass'


let userData = {
    short_token: "",
    user_id: "",
    long_token: ""
}

module.exports = {
    receiveAuthCode: (req, res) => {
        let authorization_code = req.query.code

        PostExchangeCodeForToken(AccessTokenURL, CLIENT_ID, ClIENT_SECRET, REDIRECT_URI, authorization_code)
        res.json({
            // Only need to send back a success page if request worked.
            authorization_code: authorization_code
        })

    },

    accessToken: (req, res) => {
        let tokenData = {
            access_token: req.body.access_token,
            user_id: req.body.user_id
        }

        console.log(`Your access token is: ${tokenData.access_token} and your user id is ${tokenData.user_id}`)

        res.json({
            access_token: tokenData.access_token,
            user_id: tokenData.user_id
        })
    }
};
