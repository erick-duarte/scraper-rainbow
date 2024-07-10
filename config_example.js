const config = {
    "email": "USUARIO-RAINBOW",
    "password": "SENHA-RAINBOW",
    "systemid": "SYSTEMID",

    "create_extension": false,
    "ip_freepbx": "0.0.0.0",
    "freepbx_username": "USUARIO-FREEPBX",
    "freepbx_password": "SENHA-FREEPBX",
    
    "db": {
        "client": "mysql",
        "connection": {
            "host": "0.0.0.0",
            "user": "rainbow",
            "password": "SENHA-DB",
            "database": "asterisk"
        }
    }
}

module.exports = { config }