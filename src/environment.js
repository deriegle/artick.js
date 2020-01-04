const path = require('path');

module.exports = {
  APP_START: new Date().getTime(),
  APP_PATH: path.join(process.cwd(), 'app/'),
  BASE_PATH: path.join(process.cwd(), '/'),
  SYS_PATH: path.join(process.cwd(), 'src/'),
  EXT: '.js',
  VIEW_EXT: '.ejs',
};
