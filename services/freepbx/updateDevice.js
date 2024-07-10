const { config } = require('../../config/config');
const { createExtension } = require('./createExtension');
const knex = require('knex');

const db = knex(config.db);

// Verificação de conexão com o banco de dados
db.raw('select 1+1 as result')
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
    })
    .catch((err) => {
        console.error('Erro ao conectar com o banco de dados:', err);
        process.exit(1);
    });

async function updateDevicesFreePbx(devices, phpSessId){
    console.log('Atualizando os dispositivos no FreePBX...')
    const promises = devices.map(async (device) => {
        const existingDevice = await db('sip').where({ keyword: 'secret', id: device.shortnumber }).first();
        let response;
        if (existingDevice) {
            response = await db('sip').update({ data: device.password }).where({ keyword: 'secret', id: device.shortnumber });
            console.log(`Dispositivo ${device.shortnumber} atualizado com sucesso.`)
        } else {
            if(config.create_extension){
                console.log('Criando dispositivo no FreePBX...', device.shortnumber)
                const res = await createExtension(device.shortnumber, device.userdisplayname, device.password, phpSessId);
                if(res == 200){
                    console.log(`Dispositivo ${device.shortnumber} criado com sucesso. Resposta: ${res}`)
                    response = `Created: ${device.shortnumber}`;
                }
            }
        }
        return response;
    })

    const results = await Promise.all(promises);
    return results;
}

module.exports = {
    updateDevicesFreePbx
}