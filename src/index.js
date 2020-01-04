const path = require('path');
const Config = require('./config');

global.APP_START = new Date().getTime();
global.APP_PATH = path.join('..', 'application', '/');
global.BASE_PATH = path.join('..', '/');
global.SYS_PATH = path.join('..', 'system', '/');
global.EXT = '.js';
global.VIEW_EXT = '.ejs';
