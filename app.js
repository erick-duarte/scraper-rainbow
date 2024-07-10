const puppeteer = require('puppeteer');
const crypto = require('crypto');

const { config } = require('./config/config');
const { email, password } = config;

// Rainbow
const { loginRainbow } = require('./services/rainbow/login');
const { listDevicesRainbow } = require('./services/rainbow/listDevices');
const { getInformationDevicesRainbow } = require('./services/rainbow/infoDevices');

// FreePBX
const { loginFreePbx } = require('./services/freepbx/login');
const { updateDevicesFreePbx } = require('./services/freepbx/updateDevice');
const { reloadFreePbx } = require('./services/freepbx/reload');

(async () => {
    const browser = process.env.NODE_ENV === 'development' ? await puppeteer.launch({ headless: false }) 
        : await puppeteer.launch({ headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
    
    const page = await browser.newPage();
    await page.goto('https://web.openrainbow.com/rb/2.135.20/index.html#/login');

    await page.waitForSelector('body');

    const configObject = await page.evaluate(() => {
        return window.config;
    });

    const rainbowApiClientKey = configObject.rainbowApiClientKey;
    const appModuleKey = configObject.appModuleKey;

    await browser.close();

    const XRainbowAppAuth = generateRainbowAppAuth(rainbowApiClientKey, appModuleKey, password)
    const Authorization = generateAuthorization(email, password)

    const tokenLogin = await loginRainbow(XRainbowAppAuth, Authorization);
    const resDevices = await listDevicesRainbow(tokenLogin);
    const resInformationDevices = await getInformationDevicesRainbow(tokenLogin, resDevices);

    console.log(resInformationDevices)
    // process.exit(0);

    const phpSessId = await loginFreePbx();
    const resUpdateDevices = await updateDevicesFreePbx(resInformationDevices, phpSessId);
    await reloadFreePbx(phpSessId);
    
    console.log(resUpdateDevices);
    process.exit(0);
})();

function generateRainbowAppAuth(apiClientKey, appModuleKey, password) {
    const appAuth = `${apiClientKey}:${crypto.createHash('sha256').update(appModuleKey + password).digest('hex')}`;
    const base64AppAuth = Buffer.from(appAuth).toString('base64');
    return `Basic ${base64AppAuth}`;
}

function generateAuthorization(email, password){
    return `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`
}