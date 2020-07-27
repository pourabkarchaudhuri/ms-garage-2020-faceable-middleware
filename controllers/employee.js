const asyncHandler = require('../middleware/async');
const employeeService = require('../services/employee');
const assetManagement = require('../services/assetManagement');
const { assetmanagement } = require('../config/db');

exports.register = asyncHandler(async (req, res, next) => {
    const employeeDetails = await employeeService.registerEmployee(req.body);

    res.status(201).json({
        success: true,
        data: employeeDetails
    });
})

exports.fetchEmployee = asyncHandler(async (req, res, next) => {
    const employeeDetails = await employeeService.fetchEmployeeDetails(req.params.empId);
    const assetDetails = await assetManagement.getAssets(req.params.empId)

    if (assetDetails.length == 0) {
        employeeDetails.assetDetails = assetDetails; 
    } else {
        const assets = [];
        assetDetails.forEach((element, idx) => {
            assets.push({
                label: element.deviceName,
                value: element.deviceName,
                key: idx});
        })
        employeeDetails.assetDetails = assets;
    }

    res.status(200).json({
        success: true,
        data: employeeDetails
    });
})

exports.trainEmployee = asyncHandler(async (req, res, next) => {
    const employeeDetails = await employeeService.trainEmployee(req.body);

    if (employeeDetails.error) {
        res.status(400).json({
            success: false,
            data: employeeDetails.response
        });
    } else {
        res.status(200).json({
            success: true,
            data: employeeDetails
        });
    }
})

exports.recognize = asyncHandler(async (req, res, next) => {
    const employeeDetails = await employeeService.recognizeEmployee(req.body.imageString);

    if (employeeDetails.error) {
        res.status(400).json({
            success: false,
            data: employeeDetails.response
        });
    } else {
        res.status(200).json({
            success: true,
            data: employeeDetails
        });
    }
}) 