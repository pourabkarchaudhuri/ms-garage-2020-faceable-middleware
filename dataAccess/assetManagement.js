const { assetmanagement } = require('../config/db');

const collectionName = 'assetManagement';

exports.create = async (assetDetails) => {
    const { body } = await assetmanagement.items.create(assetDetails);
    return body;
}

exports.getAssetDetails = async (deviceName) => {
    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.deviceName = @value`,
        parameters: [
            {
                name: '@value',
                value: deviceName // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };

    const { result } = await assetmanagement.items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    return result;
}

exports.getRecordsByquery = async (querySpec) => {
    const { result } = await assetmanagement.items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    return result;
}