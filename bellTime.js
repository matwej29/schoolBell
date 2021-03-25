const SettingController = require("./settingsController.js");
const settingController = new SettingController();
class Controller {
  constructor() {
    this.founded = false;
  }
  check() {
    if (settingController.Read().enabled == 0) return;
    let lessons = settingController.Read().lessons;
    let now = new Date();
    now = [now.getHours(), now.getMinutes()].join(" ");
    lessons = lessons.map((item) => {
      item = item.split(" ");
      return (item = [item[0] + " " + item[1], item[2] + " " + item[3]]);
    });
    lessons.forEach((element) => {
      if (this.founded == false && element.includes(now)) {
        if (element.indexOf(now) == 0) {
          console.log("Звонок на урок");
        } else {
          console.log("Звонок с урока");
        }
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
