const path = require('path');

module.exports = {
  APP_START: new Date().getTime(),
  APP_PATH: path.join('..', 'app', '/'),
  BASE_PATH: path.join('..', '/'),
  SYS_PATH: path.join('..', 'src', '/'),
  EXT: '.js',
  VIEW_EXT: '.ejs',
};
