const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' });

module.exports = {
    endpoint: process.env.COSMOS_DB_URL,
    masterKey: process.env.COSMOS_DB_KEY,
    databaseDefName: process.env.DB_NAME,
    settingsContainer: 'settings',
    employeeContainer: 'employee',
  };

  /**
   * Create the container if it does not exist
   */
//   const { container } = await client
//   .database(databaseDefName)
//   .containers.createIfNotExists(
//     { id: 'events' } 
//   );