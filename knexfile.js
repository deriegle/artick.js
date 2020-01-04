const Config = require('./src/config');

const defaultDatabase = Config.get('db.default');
const connection = Config.get(`db.connections`).sqlite3

console.log({
  defaultDatabase,
  connection,
});

module.exports = {
  client: defaultDatabase,
  connection,
  useNullAsDefault: true,
};
