const path = require('path');
const fs = require('fs');

class Config {
  constructor() {
	/**
	 * All of the loaded configuration items.
	 */
    this.items = {};
  }

  get(key) {
		// ---------------------------------------------
		// Parse the configuration key.
		// ---------------------------------------------
    const [file, key] = this.parse(key);

		// ---------------------------------------------
		// Load the configuration file.
		// ---------------------------------------------
    this.load(file);

    return this.items[file][key];
	}

	/**
	 * Set a configuration item.
	 *
	 * @param  string  $key
	 * @param  mixed   $value
	 * @return void
	 */
	set(key, value) {
		// ---------------------------------------------
		// Parse the configuration key.
		// ---------------------------------------------
		const [file] = this.parse(key);

		// ---------------------------------------------
		// Load the configuration file.
		// ---------------------------------------------
    this.load(file);

		// ---------------------------------------------
		// Set the item's value.
		// ---------------------------------------------
    this.items[file][key] = value;
	}

	/**
	 * Parse a configuration key.
	 *
	 * @param  string  $key
	 * @return array
	 */
	parse(key) {
		// ---------------------------------------------
		// Get the key segments.
		// ---------------------------------------------
    segments = key.split('.');

		// ---------------------------------------------
		// Validate the key format.
		// ---------------------------------------------
    if (segments.length < 2) {
			throw new Error(`Invalid configuration key [${key}].`);
		}

		// ---------------------------------------------
		// Return the file and item name.
		// ---------------------------------------------
    return [
      segments[0],
      segments.slice(1).join('.')
    ];
	}

	/**
	 * Load all of the configuration items.
	 *
	 * @param  string  $file
	 * @return void
	 */
	load(file) {
		// ---------------------------------------------
		// If the file has already been loaded, bail.
		// ---------------------------------------------
    if (this.items[file]) { return; }

		// ---------------------------------------------
		// Verify that the configuration file exists.
		// ---------------------------------------------
    const filePath = path.join(global.APP_PATH, 'config', `${file}${global.EXT}`);

    if (!fs.existsSync(filePath)) {
			throw new Error(`Configuration file [${file}] does not exist.`);
		}

		// ---------------------------------------------
		// Load the configuration file.
		// ---------------------------------------------
    this.items[file] = require(filePath);
	}
}
