const Config = require('../config');
const fs = require('fs');
const dbConfig = require('../../app/config/db.js');

jest.mock('fs');
jest.mock('../../app/config/db', () => ({
  default: 'mysql',
}));

describe('Config', () => {
  beforeEach(() => fs.existsSync.mockReset());

  describe('get', () => {
    it('works', () => {
      fs.existsSync.mockReturnValue(true);

      const defaultDb = Config.get('db.default');

      expect(defaultDb).toBe('mysql');
    });

    it('throws an error when given an invalid key', () => {
      expect(() => Config.get('db')).toThrow('Invalid configuration key [db]');
    });

    it('when the config file does not exist', () => {
      expect(() => {
        fs.existsSync.mockReturnValue(false);

        Config.get('db.default')
      }).toThrow('Configuration file [db] does not exist.');
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

    it('when the config file does not exist', () => {
      expect(() => {
        fs.existsSync.mockReturnValue(false);

        Config.set('db.default', 'postgres');
      }).toThrow('Configuration file [db] does not exist.');
    });
  });
});
