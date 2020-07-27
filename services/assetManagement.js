
const employeeDAO = require('../dataAccess/employee');
const assetManagementDAO = require('../dataAccess/assetManagement');
const ErrorResponse = require('../utils/errorResponse');

const collectionName = 'assetmanagement';

exports.registerDevice = async (assetDetails) => {

    const id = Math.floor(Math.random() * 900000000) + 100000000;
    assetDetails.id = id.toString();

    const employeeExists = await employeeDAO.getEmployeeByEmpId(assetDetails.empId);

    if (employeeExists.length == 0) {
        throw new ErrorResponse(
            `The employee with empId ${assetDetails.empId} not found`,
            400
        )
    }

    const employeeDetails = await assetManagementDAO.create(assetDetails);
    return employeeDetails;
}

exports.getAssets = async (empId) => {

    const querySpec = {
        query:
            `SELECT e.deviceName FROM ${collectionName} e WHERE e.empId = @value`,
        parameters: [
            {
                name: '@value',
                value: Number(empId) // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };
    const recordExists = await assetManagementDAO.getRecordsByquery(querySpec);

    return recordExists;
}