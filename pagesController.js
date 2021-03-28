const SettingController = require("./settingsController.js");
const settingController = new SettingController();

const fs = require("fs");

class Controller {
  home(req, res) {
    settingController.test();
    const setting = settingController.Read();
    const times = setting.firstLesson.split(" ");
    const bells = (i) =>
      fs.readdirSync("./static/sounds").map((item) => {
        return {
          value: item,
          selected: item == setting.bells[i],
        };
      });
    let lessons = setting.lessons;
    lessons = lessons.map((item) => {
      return (item = item.split(" ").map((item, index) => {
        let value = item;
        item = {};
        item.value = value;
        item.name = index == 0 ? "s" : "e";
        item.type = "time";
        return item;
      }));
    });
    res.render("layout", {
      StartH: {
        type: "time",
        value: times[0],
        name: "Start",
      },
      EndH: {
        type: "time",
        value: times[1],
        name: "End",
      },
      BrakeDuration: {
        value: setting.brakeDuration,
        name: "bDuration",
      },
      numberOfLessons: {
        value: setting.numberOfLessons,
        name: "numberOfLessons",
      },
      lessons: lessons,
      enabled: +setting.enabled,
      Lbells: bells(0),
      Bbells: bells(1),
    });
  }

  save(req, res) {
    const setting = settingController;
    let lessons = [];
    const [start, end] = [req.body.s, req.body.e];
    const lesson = (i) => {
      return [start[i], end[i]].join(" ");
    };
    const firstLesson = lesson(0);
    const sRead = setting.Read();
    if (
      req.body.numberOfLessons != sRead.numberOfLessons ||
      firstLesson != sRead.firstLesson ||
      req.body.bDuration != sRead.brakeDuration
    ) {
      lessons = setting.CountLessons(
        firstLesson,
        req.body.numberOfLessons,
        req.body.bDuration
      );
    } else {
      for (let i = 1; i <= req.body.numberOfLessons; i++) {
        lessons.push(lesson(i));
      }
    }
    const settings = {
      enabled: req.body.enable,
      firstLesson: firstLesson,
      brakeDuration: req.body.bDuration,
      numberOfLessons:
        req.body.numberOfLessons > 19 ? 19 : req.body.numberOfLessons,
      lessons: lessons.length > 19 ? lessons.slice(0, 19) : lessons,
      bells: req.body.bell,
    };
    settingController.Write(settings);
    res.redirect("/");
  }
}

module.exports = Controller;
