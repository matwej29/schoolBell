const SettingController = require("./settingsController.js");
const settingController = new SettingController();

const fs = require("fs");
const player = require("play-sound")((opts = {}));

class Controller {
  constructor() {
    this.founded = false;
  }

  play(lesson, bells) {
    if (lesson) {
      console.log(bells);
      player.play(`./static/sounds/${bells[0]}`);
    } else {
      player.play(`./static/sounds/${bells[1]}`);
    }
  }

  check() {
    if (settingController.Read().enabled == 0) return;
    // console.log(fs.readdirSync("./static/sounds"));
    let lessons = settingController.Read().lessons;
    let now = new Date();
    now = [now.getHours(), now.getMinutes()].join(" ");
    lessons = lessons.map((item) => {
      item = item.split(" ");
      return (item = [item[0] + " " + item[1], item[2] + " " + item[3]]);
    });
    lessons.forEach((element) => {
      if (this.founded == false && element.includes(now)) {
        this.play(
          element.indexOf(now) == 0 ? true : false,
          settingController.Read().bells
        );
        this.founded = true;
        console.log(this.founded);
        setTimeout(() => {
          this.founded = false;
          console.log(this.founded);
        }, 61000);
      }
    });
  }
}

module.exports = Controller;
