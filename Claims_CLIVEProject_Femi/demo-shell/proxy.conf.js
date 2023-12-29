require('dotenv').config();

const { getDeployedAppsProxy, getShareProxy, getApsProxy, getIdentityAdapterServiceProxy } = require('./proxy-helpers');

//const legacyHost = process.env.PROXY_HOST_ADF;
//const cloudHost = process.env.CLOUD_PROXY_HOST_ADF || process.env.PROXY_HOST_ADF;
//const cloudApps = process.env.APP_CONFIG_APPS_DEPLOYED;
//const apsHost = process.env.PROXY_HOST_ADF;

var legacyHost = "http://ec2-54-210-169-94.compute-1.amazonaws.com";
var apsHost = "http://ec2-54-210-169-94.compute-1.amazonaws.com";



module.exports = {
    ...getShareProxy(legacyHost),
    ...getApsProxy(apsHost),
//    ...getDeployedAppsProxy(cloudHost, cloudApps),
 //   ...getIdentityAdapterServiceProxy(cloudHost)
};
