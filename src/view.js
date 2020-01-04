const fs = require('fs');
const path = require('path');
const environment = require('./environment');
const ejs = require('ejs');

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
    const appFilePath = path.join(__dirname, environment.APP_PATH, 'views', `${view}${environment.VIEW_EXT}`);
    const sysFilePath = path.join(__dirname, environment.SYS_PATH, 'views', `${view}${environment.VIEW_EXT}`);
    let string;

    if (fs.existsSync(appFilePath)) {
      string = fs.readFileSync(appFilePath, 'utf-8');
    }

    if (fs.existsSync(sysFilePath)) {
      string = fs.readFileSync(sysFilePath, 'utf-8');
    }

    if (!string) {
      console.log(appFilePath);
      console.log(sysFilePath);
      throw new Error(`View [${view}] doesn't exist`);
    }

    return ejs.render(string);
  }
}

module.exports = View;
