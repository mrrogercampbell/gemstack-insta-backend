const { PostExchangeCodeForToken, GetUserProfileData, ExchangeShortTokenForLongToken, GetMediaData } = require('../logic/ApiClass')


let userData = {
    short_token: "",
    user_id: "",
    long_token: ""
}

module.exports = {
    receiveAuthCode: (req, res) => {
        let authorization_code = req.query.code

        PostExchangeCodeForToken(authorization_code)
        res.json({
            // Only need to send back a success page if request worked.
            authorization_code: authorization_code
        })

    },

    hello: (req, res) => {
        res.send('Hello for the win')
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
