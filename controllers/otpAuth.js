const otpAuthSerivce = require('../services/otpAuth');
const asyncHandler = require('../middleware/async');

exports.getOTP = asyncHandler(async (req, res, next) => {
    const otp = await otpAuthSerivce.getOTP(req.params.empId);

    res.status(200).json({
        success: true
    });
    
})

exports.verifyOTP = asyncHandler(async (req, res, next) => {
    const verificationDetails = await otpAuthSerivce.verifyOTP(req.query);

    if (!verificationDetails) {
        res.status(400).json({
            success: false
        });
    } else {
        res.status(200).json({
            success: true
        });
    }
})