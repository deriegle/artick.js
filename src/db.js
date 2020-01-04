const Config = require('./config');
const knex = require('knex');

function getKnexConfig() {
  const defaultDatabaseClient = Config.get('db.default');
  const allConnectionInfo = Config.get(`db.connections.${defaultDatabaseClient}`);
  const connection = { ...allConnectionInfo };

  delete connection.driver;

  if (defaultDatabaseClient === 'sqlite3') {
    const database = connection.database;

    connection.filename = `./${database}.sqlite`;
  }

  delete connection.database;

  return {
    client: defaultDatabaseClient,
    connection,
  };
}

module.exports = knex(getKnexConfig());
