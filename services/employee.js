
// const { databaseDefName, employeeContainer } = require('../config/config');

// const container = client.database(databaseDefName).container(employeeContainer);
const employeeDAO = require('../dataAccess/employee');
const ErrorResponse = require('../utils/errorResponse');
const dataURIToBuffer = require('../utils/dataURIToBuffer');
const azureFaceAPI = require('../utils/azureFaceAPI');
const azureBlob = require('../utils/azureBlob');

const collectionName = 'employees';

exports.registerEmployee = async (employee) => {

    const id = Math.floor(Math.random() * 900000000) + 100000000;
    employee.id = id.toString();

    const querySpec = {
        query:
            `SELECT * FROM ${collectionName} e WHERE e.email = @value`,
        parameters: [
            {
                name: '@value',
                value: employee.email // e.g. 'api/hero/querybyname/Aslaug',
            }
        ]
    };

    const employeeExists = await employeeDAO.getEmployee(querySpec);

    if (employeeExists.length != 0) {
        throw new ErrorResponse(
            `The employee with email ${employee.email} is already exists`,
            400
        )
    }

    const employeeDetails = await employeeDAO.createEmployee(employee);
    return employeeDetails;
}

exports.fetchEmployeeDetails = async (empId) => {

    const employeeExists = await employeeDAO.getEmployeeByEmpId(empId);

    if (employeeExists.length == 0) {
        throw new ErrorResponse(
            `The employee with empId ${empId} not found`,
            400
        )
    }

    return employeeExists[0];
}

exports.trainEmployee = async (employeeDetails) => {
    const employeeExists = await employeeDAO.getEmployeeByEmpId(employeeDetails.empId);

    if (employeeExists.length == 0) {
        throw new ErrorResponse(
            `The employee with empId ${employeeDetails.empId} not found`,
            400
        )
    }

    // Convert base64 to buffer
    const buff = await dataURIToBuffer(employeeDetails.imageString);

    // upload photo to Archieve Blob (buffer, mimetype, filename, containerName)
    await azureBlob.upload(buff, "img/jpeg", employeeDetails.empId + "-" + Date.now(), "faceartifacts");

    // Detect face from the base64 image
    const result = await azureFaceAPI.detect(buff);

    // Check for 0 or multiple faces
    if (result.length == 0) {
        // throw new ErrorResponse(
           return {
               error: true,
               response: {
                noOfFaces: 0,
                message: `No face is detected`
               }
            }
            // 400
        // )
    } else if (result.length > 1) {
        return {
            error: true,
            response: {
                noOfFaces: result.length,
                message: `More than one has detected in the image`
            }
         }
    }

    // Identify the detected face.
    const identifyResult = await azureFaceAPI.identify(result[0].faceId);

    // Check if face is identified.
    if (identifyResult[0].candidates.length == 0) {
        // Train photo with employee ID.
        const createdPerson = await azureFaceAPI.createPerson(employeeDetails.empId);

        // Add face to a person.
        const faceResult = await azureFaceAPI.addFace(buff, createdPerson.personId);

        // Train the face API
        await azureFaceAPI.train();

        return { isRecognized: false };
    } else {

        // get the person by personId.
        const faceDetails = await azureFaceAPI.getFace(identifyResult[0].candidates[0].personId);

        if (faceDetails.length != 0) {
            return { isRecognized: true };
        }
        //  else {
        //     return { isRecognized: false };
        // }
    }
    // console.log(identifyResult);
}

exports.recognizeEmployee = async (imageString) => {

    // Convert base64 to buffer
    const buff = await dataURIToBuffer(imageString);

    // upload photo to Archieve Blob (buffer, mimetype, filename, containerName)
    await azureBlob.upload(buff, "img/jpeg", Date.now(), "faceartifacts");

    // Detect face from the base64 image
    const result = await azureFaceAPI.detect(buff);

    // Check for 0 or multiple faces
    if (result.length == 0) {
        return {
            error: true,
            response: {
             noOfFaces: 0,
             message: `No face is detected`
            }
         }
    } else if (result.length > 1) {
        return {
            error: true,
            response: {
                noOfFaces: result.length,
                message: `More than one has detected in the image`
            }
         }
    }

    // Identify the detected face.
    const identifyResult = await azureFaceAPI.identify(result[0].faceId);

    // Check if face is identified.
    if (identifyResult[0].candidates.length == 0) {
        return { isRecognized: false };
    } else {
        // get the person by personId.
        const faceDetails = await azureFaceAPI.getFace(identifyResult[0].candidates[0].personId);

        console.log(faceDetails);
        if (faceDetails.length != 0) {
            return { isRecognized: true, empId: faceDetails.name };
        }
        //  else {
        //     return { isRecognized: false };
        // }
    }
}
