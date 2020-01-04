const fs = require('fs');

class View {
  constructor(view, data = {}) {
    this.view = view;
    this.data = data;
    this.content = this._load(view);
  }

  static make(view, data) {
    return new View(view, data);
  }

  bind(key, value) {
    this.data[key] = value;
    return this;
  }

  get() {
    this.last = this.view;

    return this.content;
  }

  _load(view) {
    const appFilePath = path.join(global.APP_PATH, 'views', `${view}${global.EXT}`);
    const sysFilePath = path.join(global.SYS_PATH, 'views', `${view}${global.EXT}`);

    if (fs.existsSync(appFilePath)) {
      return fs.readFileSync(appFilePath);
    }

    if (fs.existsSync(sysFilePath)) {
      return fs.readFileSync(sysFilePath);
    }

    throw new Error(`View [${view}] doesn't exist`);
  }
}
