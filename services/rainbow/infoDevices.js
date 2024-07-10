const axios = require('axios');
const { config } = require('../../config/config');

const { systemid } = config;

let allDevices = [];
async function getInformationDevicesRainbow(token, devices){
    console.log('Buscando informaçes dos dispositivos no Rainbow...')
    allDevices = devices;
    const promises = devices.map(async (device) => {
        const response = await axios.get(`https://openrainbow.com/api/rainbow/rvcpprovisioning/v1.0/cloudpbxs/${systemid}/devices/${device.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        return {
            ...response.data,
            password: response.data.password
        };
    })

    const results = await Promise.all(promises);
    
    allDevices = allDevices.map(device => {
        const info = results.find(result => result.data.id === device.id);
        return {
            ...device,
            password: info ? info.data.password : null
        };
    });
    return allDevices;
}

module.exports = {
    getInformationDevicesRainbow
}