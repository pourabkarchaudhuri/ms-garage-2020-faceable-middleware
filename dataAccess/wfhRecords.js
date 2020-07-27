const { wfhrecords } = require('../config/db');
const { identify } = require('../utils/azureFaceAPI');

const collectionName = 'wfhrecords';

exports.create = async (wfhDetails) => {
    const { body } = await wfhrecords.items.create(wfhDetails);
    return body;
}

exports.getRecordByEmpId = async (empId) => {
    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.empId = @value`,
        parameters: [
            {
                name: '@value',
                value: Number(empId) // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };

    const { result } = await wfhrecords.items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    return result;
}

exports.update = async (wfhDetails) => {

   const  { id } = wfhDetails;

    const { body } = await wfhrecords.item(id).replace(wfhDetails, { enableCrossPartitionQuery: true });
    
    return body;
}

exports.get = async () => {
    const querySpec = {
        query: `SELECT * FROM ${collectionName}`,
    };

    const { result } = await wfhrecords.items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    return result;
}

exports.getRecordsByquery = async (querySpec) => {
    const { result } = await wfhrecords.items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    return result;
}

exports.delete = async (id, empId) => {
    const { body } = await wfhrecords.item(id, empId).delete();
    return body;
}