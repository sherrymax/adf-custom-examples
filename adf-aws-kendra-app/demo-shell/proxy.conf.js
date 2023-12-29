require('dotenv').config();

// const { getDeployedAppsProxy, getShareProxy, getApsProxy, getIdentityProxy, getIdentityAdapterServiceProxy } = require('./proxy-helpers');
const { getShareProxy, getApsProxy} = require('./proxy-helpers');

if (process.env.BASE_URL === undefined) {
    console.error('Please provide BASE_URL inside your .env file!');
    process.exit(1);
}

if (process.env.CLOUD_HOST === undefined) {
    console.error('Please provide CLOUD_HOST inside your .env file!');
    process.exit(1);
}

const legacyHost = process.env.APP_CONFIG_ECM_HOST;
const cloudHost = process.env.APP_CONFIG_BPM_HOST;
const cloudApps = process.env.APP_CONFIG_APPS_DEPLOYED;
const apsHost = process.env.APP_CONFIG_BPM_HOST;
// const apsHost = "http://ec2-44-210-156-223.compute-1.amazonaws.com";//process.env.PROXY_HOST_ADF;

module.exports = {
    ...getShareProxy(legacyHost),
    //...getDeployedAppsProxy(cloudHost, cloudApps),
    //...getIdentityProxy(legacyHost),
    //...getIdentityAdapterServiceProxy(cloudHost),
    ...getApsProxy(apsHost)
};
