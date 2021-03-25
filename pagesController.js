const SettingController = require("./settingsController.js");
const settingController = new SettingController();

const fs = require("fs");

class Controller {
  home(req, res) {
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
        switch (index) {
          case 0:
            item.inputName = "LSH";
            break;
          case 1:
            item.inputName = "LSM";
            break;
          case 2:
            item.inputName = "LEH";
            break;
          case 3:
            item.inputName = "LEM";
            break;
        }
        return item;
      }));
    });
    res.render("layout", {
      StartH: {
        value: times[0],
        inputName: "LSH",
      },
      StartM: {
        value: times[1],
        inputName: "LSM",
      },
      EndH: {
        value: times[2],
        inputName: "LEH",
      },
      EndM: {
        value: times[3],
        inputName: "LEM",
      },
      BrakeDuration: {
        value: setting.brakeDuration,
        inputName: "bDuration",
      },
      numberOfLessons: {
        value: setting.numberOfLessons,
        inputName: "numberOfLessons",
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
    const [LSH, LSM, LEH, LEM] = [
      req.body.LSH,
      req.body.LSM,
      req.body.LEH,
      req.body.LEM,
    ];
    const lesson = (i) => {
      return [LSH[i], LSM[i], LEH[i], LEM[i]].join(" ");
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
