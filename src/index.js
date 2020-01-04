require('harmony-reflect');

const app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');
const Config = require('./config');
const Router = require('./router');
const Response = require('./response');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);

  next();
});

app.all('*', async (req, res) => {
  const route = Router.route(req.method, req.path); 
  let response;

  if (route) {
    response = await route.call();
  } else {
    response = Response.view('error/404', 404);
  }

  response.send(res);
});


app.listen(3000, () => console.log('listening on 3000'));
