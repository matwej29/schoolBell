const SettingController = require("./settingsController.js");
const settingController = new SettingController();

const fs = require("fs");

class Controller {
  home(req, res) {
    const setting = settingController.Read();
    const firstLesson = settingController.lessons[0];
    const bells = (i) =>
      fs.readdirSync("./static/sounds").map((item) => {
        return {
          value: item,
          selected: item == setting.bells[i],
        };
      });

    let lessons = settingController.lessons;
    console.log(lessons);
    res.render("layout", {
      StartH: {
        type: "time",
        value: firstLesson.timeStart,
        name: "Start",
      },
      EndH: {
        type: "time",
        value: firstLesson.timeEnd,
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

  // not working yet
  save(req, res) {
    return;
    const setting = settingController;
    const [start, end] = [req.body.timeStart, req.body.timeEnd];
    const lesson = (i) => {
      return [start[i], end[i]].join(" ");
    };
    const firstLesson = {
      id: 0,
      timeStart: req.body.Start,
      timeEnd: req.body.End,
    };
    let lessons = [firstLesson];
    const sRead = setting.Read();
    if (
      req.body.numberOfLessons != sRead.numberOfLessons ||
      firstLesson != sRead.firstLesson ||
      firstLesson != lesson(0) ||
      req.body.bDuration != sRead.brakeDuration
    ) {
      lessons = setting.CountLessons(
        firstLesson,
        req.body.numberOfLessons,
        req.body.bDuration
      );
    } else {
      for (let i = 1; i < req.body.numberOfLessons; i++) {
        lessons.push(lesson(i));
      }
    }
    const settings = {
      enabled: req.body.enable,
      firstLesson: firstLesson,
      brakeDuration: req.body.bDuration,
      numberOfLessons:
        req.body.numberOfLessons > 19 ? 19 : req.body.numberOfLessons,
      bells: req.body.bell,
    };
    settingController.dbWriteLessons(
      lessons.length > 19 ? lessons.slice(0, 19) : lessons
    );
    settingController.Write(settings);
    res.redirect("/");
  }
}

module.exports = Controller;
