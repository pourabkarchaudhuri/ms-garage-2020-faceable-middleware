const asyncHandler = require('../middleware/async');
const assetManagementService = require('../services/assetManagement');

exports.register = asyncHandler(async (req, res, next) => {
    const employeeDetails = await assetManagementService.registerDevice(req.body);

    res.status(201).json({
        success: true,
        data: employeeDetails
    });
})