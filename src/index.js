const app = require('express')();
const path = require('path');
const Config = require('./config');
const Router = require('./router');
const Response = require('./response');

global.APP_START = new Date().getTime();
global.APP_PATH = path.join('..', 'application', '/');
global.BASE_PATH = path.join('..', '/');
global.SYS_PATH = path.join('..', 'system', '/');
global.EXT = '.js';
global.VIEW_EXT = '.ejs';

app.use(bodyParser.urlEncoded({ extended: true }));
app.use(bodyParser.json());

app.all('/', (req, res) => {
  const route = Router.route(req.method, req.path); 
  let response;

  if (route) {
    response = route.call();
  } else {
    response = Response.view('error/404', 404);
  }

  response.send(res);
});


app.listen(3000);
