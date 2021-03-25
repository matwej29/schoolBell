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
    });
  }

  save(req, res) {
    const setting = settingController;
    let lessons = [];
    if (req.body.numberOfLessons != setting.Read().numberOfLessons) {
      lessons = setting.CountLessons(
        [
          req.body.LSH[0],
          req.body.LSM[0],
          req.body.LEH[0],
          req.body.LEM[0],
        ].join(" "),
        req.body.numberOfLessons
      );
      const settings = {
        enabled: req.body.enable,
        firstLesson: [
          req.body.LSH[0],
          req.body.LSM[0],
          req.body.LEH[0],
          req.body.LEM[0],
        ].join(" "),
        brakeDuration: req.body.bDuration,
        numberOfLessons: req.body.numberOfLessons,
        lessons: lessons,
      };
      setting.Write(settings);
    } else {
      lessons = [];
      for (let i = 1; i <= req.body.numberOfLessons; i++) {
        const param = [`${i} + LSH`, `${i} + LSM`];
        lessons.push(
          [
            req.body.LSH[i],
            req.body.LSM[i],
            req.body.LEH[i],
            req.body.LEM[i],
          ].join(" ")
        );
      }
    }
    const settings = {
      enabled: req.body.enable,
      firstLesson: [
        req.body.LSH[0],
        req.body.LSM[0],
        req.body.LEH[0],
        req.body.LEM[0],
      ].join(" "),
      brakeDuration: req.body.bDuration,
      numberOfLessons: req.body.numberOfLessons,
      lessons: lessons,
    };
    settingController.Write(settings);
    res.redirect("/");
  }

  count(req, res) {
    console.log(req.body);
    settingController.Write(
      settingController.CountLessons(
        [
          req.body.LSH[0],
          req.body.LSM[0],
          req.body.LEH[0],
          req.body.LEM[0],
        ].join(" ")
      )
    );
    res.redirect("/");
  }
}

module.exports = Controller;
