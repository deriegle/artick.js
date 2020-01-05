const Eloquent = require('../../src/eloquent');
const User = require('./account');

class Account extends Eloquent {
  users() {
    return this.hasMany(User);
  }
}

Account.table = 'accounts';

module.exports = Account;
