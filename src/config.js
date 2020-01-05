const path = require('path');
const environment = require('./environment');
const fs = require('fs');

class Config {
  constructor() {
    this.items = {};
  }

  get(key) {
    const [file, configKey] = this._parse(key);

    this._load(file);

    return this.items[file][configKey];
	}

	set(key, value) {
		const [file, configKey] = this._parse(key);

    this._load(file);

    this.items[file][configKey] = value;
	}

	_parse(key) {
    const segments = key.split('.');

    if (segments.length < 2) {
			throw new Error(`Invalid configuration key [${key}].`);
		}

    return [
      segments[0],
      segments.slice(1).join('.')
    ];
	}

	_load(file) {
    if (this.items[file]) { return; }

    const filePath = path.join(environment.APP_PATH, 'config', `${file}${environment.EXT}`);

    if (!fs.existsSync(filePath)) {
			throw new Error(`Configuration file [${file}] does not exist.`);
		}

    this.items[file] = require(filePath);
	}
}

module.exports = new Config();
