const Eloquent = require('../eloquent');

describe('Eloquent', () => {
  it('delegates the attributes object keys first', () => {
    const model = new Eloquent();

    model.attributes = {
      userName: 'deriegle',
      email: 'riegledevin@gmail.com',
      password: '1234',
    };

    expect(model.userName).toBe('deriegle');
    expect(model.email).toBe('riegledevin@gmail.com');
    expect(model.password).toBe('1234');
  });
});
