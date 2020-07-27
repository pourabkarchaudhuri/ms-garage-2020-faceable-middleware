// @ts-check
const cosmos = require('@azure/cosmos');
const { endpoint, masterKey, databaseDefName } = require('./config');

const { CosmosClient } = cosmos;
const client = new CosmosClient({ endpoint, auth: { masterKey } });

// module.exports = client;

// const containers = {
//   employees: client.database(databaseDefName).container('employees'),
//   assetmanagement: client.database(databaseDefName).container('assetmanagement'),
//   wfhrecords: client.database(databaseDefName).container('wfhrecords'),
//   events: client.database(databaseDefName).container('events')
// };

module.exports = {
    employees: client.database(databaseDefName).container('employees'),
    assetmanagement: client.database(databaseDefName).container('assetmanagement'),
    wfhrecords: client.database(databaseDefName).container('wfhrecords'),
    events: client.database(databaseDefName).container('events'),
    otpauth: client.database(databaseDefName).container('otpauth')
};
