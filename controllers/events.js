const asyncHandler = require('../middleware/async');
const eventsServices = require('../services/events');

exports.register = asyncHandler(async (req, res, next) => {
    const events = await eventsServices.registerEvent(req.body);

    res.status(201).json({
        success: true
    });
    
})

exports.getEvents = asyncHandler(async (req, res, next) => {

    if (req.query.search != "") {
        const result = await eventsServices.getRecordById(req.query.search);
        console.log(result);

        res.status(200).json({
            success: true,
            data: result.reverse(),
            totalPage: 1,
            totalItem: result.length
        });
    } else {

    
    const result = await eventsServices.getRecords();

    res.status(200).json({
        success: true,
        data: result.reverse(),
        totalPage: 1,
        totalItem: result.length
    });
}
})

exports.chartData = asyncHandler(async (req, res, next) => {
    const events = await eventsServices.getChartData();

    res.status(201).json({
        success: true,
        data: events
    });
    
})