const Config = require('./config');
const knex = require('knex');

function getKnexConfig() {
  const defaultDatabaseClient = Config.get('db.default');
  const allConnectionInfo = Config.get('db.connections')[defaultDatabaseClient];
  const connection = { ...allConnectionInfo };

  delete connection.driver;
  delete connection.database;

  return {
    client: defaultDatabaseClient,
    connection,
    useNullAsDefault: true,
  };
}

module.exports = knex(getKnexConfig());
