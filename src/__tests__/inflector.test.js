const Inflector = require('../inflector');

describe('Inflector', () => {
  describe('plural', () => {
    it('works', () => {
      expect(Inflector.plural('deer')).toBe('deer');
      expect(Inflector.plural('foot')).toBe('feet');
      expect(Inflector.plural('child')).toBe('children');
      expect(Inflector.plural('user')).toBe('users');
      //expect(Inflector.plural('account')).toBe('accounts');
    });
  });

  describe('singular', () => {
    it('works', () => {
      expect(Inflector.singular('deer')).toBe('deer');
      expect(Inflector.singular('feet')).toBe('foot');
      expect(Inflector.singular('children')).toBe('child');
      expect(Inflector.singular('users')).toBe('user');
      expect(Inflector.singular('accounts')).toBe('account');
    });
  });

  describe('pluralIf', () => {
    it('works',() => {
      expect(Inflector.pluralIf('user', 1)).toBe('user');
      expect(Inflector.pluralIf('user', 2)).toBe('users');
    });
  });
});
