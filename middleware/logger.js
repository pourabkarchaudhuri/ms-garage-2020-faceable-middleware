// @desc    Logs request to console
const loggerConfiguration = require('../utils/log');
const log = loggerConfiguration.loggerob;

const logger = (req, res, next) => {
  log.info('info: ', `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} req body: ${req.body}, req params: ${req.params}, req query: ${req.query}`);
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  next();
};

module.exports = logger;
