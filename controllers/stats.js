const asyncHandler = require('../middleware/async');
const stats = require('../services/stats');
const events = require('../services/events');

exports.getStats = asyncHandler(async (req, res, next) => {
    const statsResult = await stats.getStats();
    const result = await events.getChartData();
    statsResult.chartData = result;


    res.status(200).json({
        success: true,
        data: statsResult
    });
    
})