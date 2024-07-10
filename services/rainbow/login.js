const axios = require('axios');

async function loginRainbow(XRainbowAppAuth, Authorization){
    console.log('Logando no Rainbow...')
    const response = await axios.get(`https://openrainbow.com/api/rainbow/authentication/v1.0/login`,
        {
            headers: {
                'X-Rainbow-App-Auth': XRainbowAppAuth,
                'Authorization': Authorization
            }
        }
    );
    return response.data.token;
}

module.exports = {
    loginRainbow
}