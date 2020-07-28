const asyncHandler = require('../middleware/async');
const wfhRecords = require('../services/wfhRecords');

const azureBlob = require('../utils/azureBlob');

exports.getWfhStatus = asyncHandler(async (req, res, next) => {
    const status = await wfhRecords.getStatus(req.params.deviceName);

    res.status(200).json({
        success: true,
        data: status
    });
})

exports.enableWfh = asyncHandler(async (req, res, next) => {
    // console.log(req.files.file1.data.length);
    // const result = await azureBlob.upload(req.files.file1.data, req.files.file1.mimetype, "file1");
    // console.log(result);

    const results = await wfhRecords.register(req.files, req.body);
    res.status(201).json({
        success: true,
        data: results
    });
    // console.log(req.body.empId, req.files);
})

exports.sendEmail = asyncHandler(async (req, res, next) => {
    // console.log(req.files.file1.data.length);
    // const result = await azureBlob.upload(req.files.file1.data, req.files.file1.mimetype, "file1");
    // console.log(result);

    const results = await wfhRecords.sendEmail(req.body);
    res.status(200).json({
        success: true,
        data: "Email has been sent to the manager for approval."
    });
    // console.log(req.body.empId, req.files);
})

exports.getWfhRecords = asyncHandler(async (req, res, next) => {

    if (req.query.search != "" && req.query.search != undefined) {
        console.log("s");
        const result = await wfhRecords.getRecordById(req.query.search);
        console.log(result);

        res.status(200).json({
            success: true,
            data: result.reverse(),
            totalPage: 1,
            totalItem: result.length
        });
    } else {
        const result = await wfhRecords.getRecords();

        res.status(200).json({
            success: true,
            data: result.reverse(),
            totalPage: 1,
            totalItem: result.length
        });
    }
})

exports.update = asyncHandler(async (req, res, next) => {
    const result = await wfhRecords.updateRecords(req.body);

    res.status(200).json({
        success: true,
        data: result
    });
})

exports.deleteRecords = asyncHandler(async (req, res, next) => {
    const result = await wfhRecords.deleteRecords(req.body.wfhList);

    res.status(200).json({
        success: true,
        data: result
    });
})

exports.approveDeny = asyncHandler(async (req, res, next) => {
    const result = await wfhRecords.approveDeny(req.body);

    res.status(200).json({
        success: true,
        data: result
    });
})