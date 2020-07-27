const { otpauth } = require('../config/db');

const collectionName = 'otpauth';

exports.create = async (otpDetails) => {
    const { body } = await otpauth.items.create(otpDetails);
    return body;
}

exports.delete = async (id, empId) => {
    const { body } = await otpauth.item(id, empId).delete();
    return body;
}

exports.getRecordByEmpId = async (empId) => {
    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.empId = @value`,
        parameters: [
            {
                name: '@value',
                value: empId // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };

    const { result } = await otpauth.items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    return result;
}

exports.getOTPDetails = async (otpDetails) => {
    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.empId = @value and e.otp = @value2`,
        parameters: [
            {
                name: '@value',
                value: otpDetails.empId // e.g. 'api/hero/querybyname/Aslaug',
            },
            {
                name: '@value2',
                value: otpDetails.otp // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };

    const { result } = await otpauth.items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    return result;
}