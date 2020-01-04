class Connector {
  constructor() {
    this.options = {
    };
  }

  connect(config) {
    switch(config.driver) {
      case 'sqlite':
        return thing;
      case 'msql':
      case 'pgsql':
        return thing;
      default:
        throw new Error(`Database driver ${config.driver} is not supported.`);
    }
  }

}

module.exports = new Connector();
