const path = require('path');

module.exports = {
  APP_START: new Date().getTime(),
  APP_PATH: path.join(__dirname, '..', 'app', '/'),
  BASE_PATH: path.join(__dirname, '/'),
  SYS_PATH: path.join(__dirname, 'src', '/'),
  EXT: '.js',
  VIEW_EXT: '.ejs',
};
