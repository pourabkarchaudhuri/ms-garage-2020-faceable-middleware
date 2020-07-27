const wfhRecordsDAO = require('../dataAccess/wfhRecords');
const assetManagementDAO = require('../dataAccess/assetManagement');
const employeeDAO = require('../dataAccess/employee');
const ErrorResponse = require('../utils/errorResponse');
const azureBlob = require('../utils/azureBlob');
const azureFaceAPI = require('../utils/azureFaceAPI');
const email = require('../utils/email');

const dataURIToBuffer = require('../utils/dataURIToBuffer');
// const emailTemplate = require('../utils/emailTemplate.html');
const fs = require('fs');


const collectionName = 'wfhrecords';

exports.getStatus = async (deviceName) => {

    const deviceDetails = await assetManagementDAO.getAssetDetails(deviceName);

    if (deviceDetails.length == 0) {
        throw new ErrorResponse(
            `The employee with device Name ${deviceName} not found`,
            400
        )
    }

    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.empId = @value and e.deviceName = @value2`,
        parameters: [
            {
                name: '@value',
                value: Number(deviceDetails[0].empId) // e.g. 'api/hero/querybyname/Aslaug',
            },
            {
                name: '@value2',
                value: deviceName // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };
    const wfhRecord = await wfhRecordsDAO.getRecordsByquery(querySpec);

    if (wfhRecord.length == 0) {
        return { isActive: false, isApproved: false, publicIP: "", result: null }
    }
    return { isActive: wfhRecord[0].isActive, isApproved: wfhRecord[0].isApproved, publicIP: wfhRecord[0].publicIP, result: wfhRecord[0] };
}

exports.register = async (files, wfhDetails) => {

    const deviceDetails = await assetManagementDAO.getAssetDetails(wfhDetails.deviceName);

    if (deviceDetails.length == 0) {
        throw new ErrorResponse(
            `The employee with device Name ${wfhDetails.deviceName} not found`,
            400
        )
    }
    console.log(wfhDetails.empId);
    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.empId = @value and e.deviceName = @value2`,
        parameters: [
            {
                name: '@value',
                value: Number(wfhDetails.empId) // e.g. 'api/hero/querybyname/Aslaug',
            },
            {
                name: '@value2',
                value: wfhDetails.deviceName // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };
    const recordExists = await wfhRecordsDAO.getRecordsByquery(querySpec);

    if (recordExists.length == 0) {
        // Create a WFH record

        // const result = await azureBlob.upload(req.files.photo1.data, req.files.photo1.mimetype, String(wfhDetails.empId) + '-' + Date.now() );
        // upload photo to Archieve Blob (buffer, mimetype, filename, containerName)
        console.log(files);
        if (files) {
            await azureBlob.upload(files.photo1.data, "img/jpeg", wfhDetails.empId + "-" + Date.now(), "faceartifacts");
            await azureBlob.upload(files.photo2.data, "img/jpeg", wfhDetails.empId + "-" + Date.now(), "faceartifacts");
        }
        // console.log(result);

        const id = Math.floor(Math.random() * 900000000) + 100000000;
        wfhDetails.id = id.toString();

        wfhDetails.isActive = true;
        wfhDetails.serviceRunning = false;
        wfhDetails.interval = "";
        wfhDetails.publicIP = "";
        wfhDetails.isApproved = true;
        wfhDetails.empId = Number(wfhDetails.empId);

        wfhDetails.startDate = new Date(wfhDetails.startDate);
        wfhDetails.endDate = new Date(wfhDetails.endDate);
        const wfhResult = await wfhRecordsDAO.create(wfhDetails);
        return wfhResult;
    } else {
        // WFH record already exists.
        throw new ErrorResponse(
            `The WFH record for empId ${wfhDetails.empId} with ${wfhDetails.deviceName} already exists.`,
            400
        )
    }

    // const result = await azureFaceAPI.detect(files.photo1.data);
    // const result = await azureFaceAPI.createPerson("39344");
    // const result = await azureFaceAPI.addFace(files.photo1.data, "9f29efb8-1376-4d07-86a9-f55b1e76caa4");
    // const result = await azureFaceAPI.train();
    // console.log(result);
    // return result;

}

exports.sendEmail = async (emailDetails) => {

    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.empId = @value and e.deviceName = @value2`,
        parameters: [
            {
                name: '@value',
                value: Number(emailDetails.empId) // e.g. 'api/hero/querybyname/Aslaug',
            },
            {
                name: '@value2',
                value: emailDetails.hostName // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };
    const recordExists = await wfhRecordsDAO.getRecordsByquery(querySpec);

    if (recordExists.length != 0) {

        // get Manager's emailId
        const employeeExists = await employeeDAO.getEmployeeByEmpId(emailDetails.empId);
        recordExists[0].isApproved = false;
        await wfhRecordsDAO.update(recordExists[0]);
        const buff = await dataURIToBuffer(emailDetails.image);
        const imageName = emailDetails.empId + "-" + Date.now();

        // upload photo to Archieve Blob (buffer, mimetype, filename, containerName)
        await azureBlob.upload(buff, "img/jpeg", imageName, "emailimages");

        const rawMessage = fs.readFileSync('./utils/emailTemplate.html');
        emailDetails.heading = "Requesting new IP to whitelist";
        emailDetails.message = `Employee with empId ${emailDetails.empId} with public IP ${emailDetails.publicIP} has requested to whitelist this current IP address.`
        emailDetails.imageURI = `https://garagestorages.blob.core.windows.net/emailimages/${imageName}.jpeg`;

        emailDetails.approveLink = `http://localhost:3000/app/pages/approvedeny?empid=${emailDetails.empId}&devicename=${emailDetails.hostName}&publicip=${emailDetails.publicIP}&request=approve`;
        emailDetails.denyLink = `http://localhost:3000/app/pages/approvedeny?empid=${emailDetails.empId}&request=deny`;
        const body = new Function('const {' + Object.keys(emailDetails).join(',') + '} = this.emailDetails;return `' + rawMessage + '`').call({ emailDetails })

        console.log(body);
        const emailBody = {
            body: body,
            email: employeeExists[0].managerEmail,
            title: 'Employee IP Whitelisting Request'
        }

        await email.sendEmail(emailBody);

        return "success";
    } else {
        // WFH record already exists.
        throw new ErrorResponse(
            `The WFH record for empId ${emailDetails.empId} not found`,
            400
        )
    }

}

exports.approveDeny = async (body) => {

    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.empId = @value and e.deviceName = @value2`,
        parameters: [
            {
                name: '@value',
                value: Number(body.empId) // e.g. 'api/hero/querybyname/Aslaug',
            },
            {
                name: '@value2',
                value: body.deviceName // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };
    const recordExists = await wfhRecordsDAO.getRecordsByquery(querySpec);

    if (recordExists.length != 0) {

        recordExists[0].isApproved = true;
        recordExists[0].publicIP = body.publicIP;
        await wfhRecordsDAO.update(recordExists[0]);
        // const buff = await dataURIToBuffer(emailDetails.image);
        // const imageName = emailDetails.empId + "-" + Date.now();

        // upload photo to Archieve Blob (buffer, mimetype, filename, containerName)
        // await azureBlob.upload(buff, "img/jpeg", imageName, "emailimages");

        // const rawMessage = fs.readFileSync('./utils/emailTemplate.html');
        // emailDetails.heading = "IP whitelist Request Approved";
        // emailDetails.message = `Employee with empId ${emailDetails.empId} with public IP ${emailDetails.publicIP} has requested to whitelist this current IP address.`
        // emailDetails.imageURI = `https://garagestorages.blob.core.windows.net/emailimages/${imageName}.jpeg`;
        // const body = new Function('const {' + Object.keys(emailDetails).join(',') + '} = this.emailDetails;return `' + rawMessage + '`').call({ emailDetails })

        // console.log(body);
        // const emailBody = {
        //     body: body,
        //     email: employeeExists[0].managerEmail,
        //     title: 'Employee IP Whitelisting Request'
        // }

        // await email.sendEmail(emailBody);

        return "success";
    } else {
        // WFH record already exists.
        throw new ErrorResponse(
            `The WFH record for empId ${body.empId} not found`,
            400
        )
    }

}


exports.getRecords = async () => {

    const wfhRecords = await wfhRecordsDAO.get();

    return wfhRecords;
}

exports.updateRecords = async (wfhDetails) => {

    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.empId = @value and e.deviceName = @value2`,
        parameters: [
            {
                name: '@value',
                value: Number(wfhDetails.empId) // e.g. 'api/hero/querybyname/Aslaug',
            },
            {
                name: '@value2',
                value: wfhDetails.deviceName // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };
    const recordExists = await wfhRecordsDAO.getRecordsByquery(querySpec);

    if (recordExists.length != 0) {

        recordExists[0].isApproved = wfhDetails.isApproved;
        recordExists[0].publicIP = wfhDetails.publicIP;
        const wfhRecords = await wfhRecordsDAO.update(recordExists[0]);
        console.log(wfhRecords);
        return wfhRecords;
    } else {
        throw new ErrorResponse(
            `The WFH record for empId ${wfhDetails.empId} not found`,
            400
        )
    }
}


exports.deleteRecords = async (wfhList) => {

    (async () => {
        for (const id of wfhList) {
            console.log(id);
            const querySpec = {
                query:
                    `SELECT * FROM ${collectionName} e WHERE e.id = @value`,
                parameters: [
                    {
                        name: '@value',
                        value: id // e.g. 'api/hero/querybyname/Aslaug',
                    }
                ]
            };
            const result = await wfhRecordsDAO.getRecordsByquery(querySpec);
            console.log(result);
            await wfhRecordsDAO.delete(id, result[0].empId);
        }
        return "success";
    })();
}

exports.getRecordById = async (id) => {
    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.empId = @value`,
        parameters: [
            {
                name: '@value',
                value: Number(id) // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };
    const recordExists = await wfhRecordsDAO.getRecordsByquery(querySpec);
    return recordExists;
}
