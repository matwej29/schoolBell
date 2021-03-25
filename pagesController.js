const SettingController = require("./settingsController.js");
const settingController = new SettingController();

class Controller {
  home(req, res) {
    const setting = settingController.Read();
    const times = setting.firstLesson.split(" ");
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
        action: "/save",
        value: times[0],
        inputName: "LSH",
      },
      StartM: {
        action: "/save",
        value: times[1],
        inputName: "LSM",
      },
      EndH: {
        action: "/save",
        value: times[2],
        inputName: "LEH",
      },
      EndM: {
        action: "/save",
        value: times[3],
        inputName: "LEM",
      },
      BrakeDuration: {
        action: "/save",
        value: setting.brakeDuration,
        inputName: "bDuration",
      },
      numberOfLessons: {
        action: "/save",
        value: setting.numberOfLessons,
        inputName: "numberOfLessons",
      },
      lessons: lessons,
      enabled: setting.enabled == "1" ? true : false,
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
    if (req.body.numberOfLessons != setting.Read().numberOfLessons) {
      lessons = setting.CountLessons(firstLesson, req.body.numberOfLessons);
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
    };
    settingController.Write(settings);
    res.redirect("/");
  }
}

module.exports = Controller;
