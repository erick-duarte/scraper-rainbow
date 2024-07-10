const axios = require('axios');
const { config } = require('../../config/config');

async function loginFreePbx(){
    console.log('Logando no FreePBX...')
    const loginResponse = await axios.post(`http://${config.ip_freepbx}/admin/config.php`, 
        `username=${config.freepbx_username}&password=${config.freepbx_password}`, 
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )

    const cookies = loginResponse.headers['set-cookie'];
    const phpSessIdCookie = cookies.find(cookie => cookie.startsWith('PHPSESSID='));
    const partCookie = phpSessIdCookie ? phpSessIdCookie.split('=')[1] : null;
    const phpSessId = partCookie ? partCookie.split(';')[0] : null;
    
    return phpSessId;
}

module.exports = {
    loginFreePbx
}