const SettingController = require("./settingsController.js");
const settingController = new SettingController();

const fs = require("fs");
const player = require("play-sound")((opts = {}));

class Controller {
  constructor() {
    this.founded = false;
  }

  play(lesson, bells) {
    console.log("play");
    if (lesson) {
      player.play(`./static/sounds/${bells[0]}`);
    } else {
      player.play(`./static/sounds/${bells[1]}`);
    }
  }

  check() {
    if (settingController.Read().enabled == 0) return;
    let lessons = settingController.Read().lessons;
    let now = new Date();
    now = [now.getHours(), now.getMinutes()].join(":");
    lessons = lessons.join(" ").split(" ");
    lessons.forEach((element) => {
      if (this.founded == false && element.includes(now)) {
        this.play(
          element.indexOf(now) == 0 ? true : false,
          settingController.Read().bells
        );
        this.founded = true;
        setTimeout(() => {
          this.founded = false;
        }, 61000);
      }
    });
  }
}

module.exports = Controller;
