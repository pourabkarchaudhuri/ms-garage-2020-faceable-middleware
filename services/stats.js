const wfhRecordsDAO = require('../dataAccess/wfhRecords');
const eventsDAO = require('../dataAccess/events');
const assetManagementDAO = require('../dataAccess/assetManagement');
const employeeDAO = require('../dataAccess/employee');
const ErrorResponse = require('../utils/errorResponse');

const dataURIToBuffer = require('../utils/dataURIToBuffer');
// const emailTemplate = require('../utils/emailTemplate.html');
const fs = require('fs');

const wfhCollectionName = 'wfhrecords';
const eventsCollectionName = 'events';

exports.getStats = async () => {

    const wfhQuerySpec = {
        query: `SELECT distinct(e.empId) FROM ${wfhCollectionName} e`
    }
    const wfhAssignedEmployees = await wfhRecordsDAO.getRecordsByquery(wfhQuerySpec);

    const eventsList = await eventsDAO.get();


    const wfhMachineQuerySpec = {
        query: `SELECT * FROM ${wfhCollectionName}`
    }
    const wfhMachineList = await wfhRecordsDAO.getRecordsByquery(wfhMachineQuerySpec);

    return {
        wfhEmployees: wfhAssignedEmployees.length,
        events: eventsList.length,
        activeMachines: wfhMachineList.length
    }
}
