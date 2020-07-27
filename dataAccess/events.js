const { events } = require('../config/db');

const collectionName = 'events';

exports.create = async (event) => {
    const { body } = await events.items.create(event);
    console.log(body);
    return body;
}

exports.get = async () => {
    const querySpec = {
        query: `SELECT * FROM ${collectionName}`,
    };

    const { result } = await events.items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    return result;
}

exports.getRecordsByquery = async (querySpec) => {
    const { result } = await events.items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    return result;
}