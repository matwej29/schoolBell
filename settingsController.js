const fs = require("fs");
class Controller {
  constructor() {
    this.settings = this.Read();
  }

  __init() {
    // TODO
  }

  Read() {
    const settings = JSON.parse(fs.readFileSync("setting.json"));
    return (this.settings = settings);
  }

  Write(settings) {
    fs.writeFileSync("setting.json", JSON.stringify(settings));
    this.Read();
  }
}

module.exports = Controller;
