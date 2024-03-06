const xsenv = require('@sap/xsenv');
const hana = require('@sap/hana-client');

var services = xsenv.getServices({
    hana: { name: 'hana' },
    hanaUrl: { name: 'hana-url' },
  });
 
services.hana.schema = process.env.HANA_SCHEMA;
services.hana.host = services.hanaUrl.host;
services.hana.port = services.hanaUrl.port;

console.log("Creating connection to SAP hana db...")
const hanaConn = hana.createConnection();

async function queryDB(sql) {
    try {
      await hanaConn.connect(services.hana);
    } catch (err) {
      console.error('queryDB connect', err.message, err.stack);
      results = err.message;
    }
    try {
      console.log(`schema: ${services.hana.schema}`)
      await hanaConn.exec('SET SCHEMA ' + services.hana.schema);
      
      results = await hanaConn.exec(sql);
      
    } catch (err) {
      console.error('queryDB exec', err.message, err.stack);
      results = err.message;
    }
    try {
      await hanaConn.disconnect();
    } catch (err) {
      console.error('queryDB disconnect', err.message, err.stack);
      results = err.message;
    }
    return results;
  }

  module.exports = {
    queryDB
  }