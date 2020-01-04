const app = require('express')();
const path = require('path');
const Config = require('./config');
const Router = require('./router');
const Response = require('./response');

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
