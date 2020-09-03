const eventsDAO = require('../dataAccess/events');
const assetManagementDAO = require('../dataAccess/assetManagement');
const ErrorResponse = require('../utils/errorResponse');
const dataURIToBuffer = require('../utils/dataURIToBuffer');
const azureBlob = require('../utils/azureBlob');
const moment = require('moment');

const collectionName = 'events';

exports.registerEvent = async (eventDetails) => {

    // Get empID from device name
    const deviceDetails = await assetManagementDAO.getAssetDetails(eventDetails.hostName);

    if (deviceDetails.length == 0) {
        throw new ErrorResponse(
            `The employee with device Name ${eventDetails.hostName} not found`,
            400
        )
    }

    const id = Math.floor(Math.random() * 900000000) + 100000000;
    const empId = deviceDetails[0].empId;

    // Create a WFH record
    // (async () => {
    //     const blobArray = [];
    //     for (const image of eventDetails.images) {
    //         // Convert base64 to buffer
    //         const buff = await dataURIToBuffer(image.image);
    //         const imageName = empId + "-" + Date.now();

    //         // upload photo to Archieve Blob (buffer, mimetype, filename, containerName)
    //         await azureBlob.upload(buff, "img/jpeg", imageName, "events");
    //         blobArray.push({
    //             imageURL: `${process.env.STORAGE_ACCOUNT_URL}/events/${imageName}.jpeg`,
    //             timestamp: image.timestamp
    //         })
    //     }
        // insert a record to events DB.
        const event = {
            id: String(id),
            empId: empId,
            eventName: eventDetails.event,
            DeviceName: eventDetails.hostName,
            macAddress: eventDetails.macAddress,
            publicIP: eventDetails.publicIP,
            // snapshots: blobArray,
            location: eventDetails.loc,
            city: eventDetails.city,
            region: eventDetails.region,
            serviceProvider: eventDetails.broadband_org,
            timestamp: new Date()
        }

        await eventsDAO.create(event);
    // })();

    return "success";

}

exports.getRecords = async () => {

    const eventRecords = await eventsDAO.get();

    return eventRecords;
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
    const recordExists = await eventsDAO.getRecordsByquery(querySpec);
    return recordExists;
}

exports.getChartData = async () => {

    // const days = { 'Sunday': 0, 'Saturday': 0, 'Friday': 0, 'Thursday': 0, 'Wednesday': 0, 'Tuesday': 0, 'Monday': 0 }

    const month = {'January': 0, 'February': 0, 'March': 0, 'April': 0, 'May': 0, 'June': 0, 'July': 0, 'August': 0, 'September': 0, 'October': 0, 'November': 0, 'December': 0}
    const eventRecords = await eventsDAO.get();
    // console.log(days);

    daysAgo = {}
    for (var i = 1; i <= 7; i++) {
        daysAgo[moment().subtract(i, 'days').format("dddd")] = 0;
    }

    eventRecords.forEach((element) => {
        if (moment(element.timestamp) > moment().subtract(1, 'weeks')) {
            // console.log();
            daysAgo[moment(element.timestamp).format('dddd')] = daysAgo[moment(element.timestamp).format('dddd')] + 1
        }

        month[moment(element.timestamp).format('MMMM')] = month[moment(element.timestamp).format('MMMM')] + 1;
    })

    const daysArray = [];
    const monthArray = [];
    const valuesArray = [];
    const yearValuesArray = [];

    for (let k in daysAgo) {
        daysArray.push(k);
        valuesArray.push(daysAgo[k]);
    }

    for (let k in month) {
        monthArray.push(k);
        yearValuesArray.push(month[k]);
    }

    console.log(monthArray, yearValuesArray);
    return {daysArray, valuesArray, monthArray, yearValuesArray};
}