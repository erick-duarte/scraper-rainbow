const axios = require('axios');
const { config } = require('../../config/config');

async function reloadFreePbx(phpSessId){
    console.log('Recarregando o FreePBX...')
    await axios.post(`http://${config.ip_freepbx}/admin/ajax.php?command=reload`, {}, {
        headers: {
            'Cookie': `PHPSESSID=${phpSessId}`,
            'Referer': `http://${config.ip_freepbx}/admin/config.php?display=extensions`
        }
    }).then(response => {
        console.log(response.data.message)
    }).catch(error => {
        console.error(error.response.data)
    });
}

module.exports = {
    reloadFreePbx
}