const axios = require('axios');
const { config } = require('../../config/config');

const { systemid } = config;

let allDevices = [];
async function listDevicesRainbow(token){
    console.log('Listando os dispositivos no Rainbow...')
    const limit = 300;
    let offset = 0;
    let totalPages;

    do {
        console.log(`Quantidade de devices: ${allDevices.length}`)
        const response = await axios.get(`https://openrainbow.com/api/rainbow/rvcpprovisioning/v1.0/cloudpbxs/${systemid}/devices?limit=${limit}&offset=${offset}`,
        // const response = await axios.get(`https://openrainbow.com/api/rainbow/rvcpprovisioning/v1.0/cloudpbxs/${systemid}/devices?limit=1&offset=0`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const devices = response.data.data
            .filter(device => device.deviceType && device.deviceType.model === 'Generic SIP')
            .map(device => ({
                id: device.id,
                description: device.description,
                shortnumber: device.shortNumber,
                userdisplayname: device.userDisplayName,
                deviceType: device.deviceType
            }));

        allDevices = allDevices.concat(devices);

        const total = response.data.total;
        totalPages = Math.ceil(total / limit);
        offset += limit;
    } while (offset / limit < totalPages);

    console.log(`Quantidade de devices total: ${allDevices.length}`)

    return allDevices;
}

module.exports = {
    listDevicesRainbow
}