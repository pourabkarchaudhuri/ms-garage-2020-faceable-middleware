const employeeDAO = require('../dataAccess/employee');
const otpAuthDAO = require('../dataAccess/otpAuth');
const ErrorResponse = require('../utils/errorResponse');
const email = require('../utils/email');
const { wfhrecords } = require('../config/db');

exports.getOTP = async (empId) => {
    const employeeExists = await employeeDAO.getEmployeeByEmpId(empId);

    if (employeeExists.length == 0) {
        throw new ErrorResponse(
            `The employee with empId ${empId} not found`,
            400
        )
    }

    // Delete previous records.
    const records = await otpAuthDAO.getRecordByEmpId(empId);

    records.map(async usr => {
        await otpAuthDAO.delete(usr.id, usr.empId);
      })

    const id = Math.floor(Math.random() * 900000000) + 100000000;
    // Generate an OTP and store it in DB
    const otp = Math.floor(Math.random() * 9000) + 1000 + '' + Date.now() % 10000;

    const otpDetails = {
        id: String(id),
        otp: otp,
        empId: empId,
        timestamp: new Date() 
    }

    await otpAuthDAO.create(otpDetails);
    const emailBody = {
        body: `Your OTP is ${otp}. Please do not share this with anyone.`,
        email: `${empId}@hexaware.com`,
        title: ' OTP service'
    }

    await email.sendEmail(emailBody);

    return "Success";

}

exports.verifyOTP = async (otpDetails) => {

    console.log(otpDetails);
    const verificationResult = await otpAuthDAO.getOTPDetails(otpDetails);

    if (verificationResult.length != 0) {
        return "Success";
    } else {
        return null
    }
}