const Config = require('../config');
const fs = require('fs');
const dbConfig = require('../../app/config/db.js');

jest.mock('fs');
jest.mock('../../app/config/db', () => ({
  default: 'mysql',
}));

describe('Config', () => {
  describe('get', () => {
    it('works', () => {
      fs.existsSync.mockImplementation(() => true);

      const defaultDb = Config.get('db.default');

      expect(defaultDb).toBe('mysql');
    });

    it('throws an error when given an invalid key', () => {
      expect(() => Config.get('db')).toThrow('Invalid configuration key [db]');
    });
  });

  describe('set', () => {
    it('overrides the value', () => {
      fs.existsSync.mockImplementation(() => true);

      let defaultDb = Config.get('db.default');

      expect(defaultDb).not.toBeNull();

      defaultDb = Config.set('db.default', 'postgres');

      expect(Config.get('db.default')).toBe('postgres');
    });

    it('throws an error when given an invalid key', () => {
      expect(() => Config.set('db', 'postgres')).toThrow('Invalid configuration key [db]');
    });
  });
});
