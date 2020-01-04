const User = require('./models/user');
const View = require('../src/view');

module.exports = {
  'GET /': async () => {
    const user = await User.find(2);

    console.log(user);

    return View.make('home/index', {
      userId: user.id,
    });
  },
  'GET /help': () => View.make('help/index'),
  'GET /faq': () => View.make('help/faq'),
};
