module.exports = {
  default: 'sqlite3',
  connections: {
    sqlite3: {
      driver: 'sqlite3',
      filename: './dev.sqlite3',
    },
    mysql: {
      driver: 'mysql',
      database: 'database',
      host: 'localhost',
      user: 'root',
      password: 'password',
      charset: 'utf8',
    },
    pgsql: {
      driver: 'pgsql',
      host: 'localhost',
      database: 'database',
      user: 'root',
      password: 'password',
      charset: 'utf8',
    },
  },
};
