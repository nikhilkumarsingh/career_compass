// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : '228405834271328', // your App ID
        'clientSecret'    : 'f810fe44cdb0a1426cee956ab074f5fe', // your App Secret
        'callbackURL'     : 'http://localhost:8080/auth/facebook/callback'
    },
    'twitterAuth' : {
        'consumerKey'        : 'Z9qBUnj2xnEiOz9pzUbZ4znkl',
        'consumerSecret'     : 'G74iIX91ysN6WFg56MGJ95h8hn5bk9TtPiSkU8uzV5uzGPUrqB',
        'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    },
    'googleAuth' : {
        'clientID'         : '719834739622-mc5l6ijbjsjr68p239bjm8082r163sdk.apps.googleusercontent.com',
        'clientSecret'     : '4yNR9Xz05NCm00sbI7huEodk',
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};