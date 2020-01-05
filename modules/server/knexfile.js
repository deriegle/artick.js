const Config = require('./src/config');

const defaultDatabase = Config.get('db.default');
const connection = Config.get(`db.connections`).sqlite3

module.exports = {
  client: defaultDatabase,
  connection,
  useNullAsDefault: true,
};
