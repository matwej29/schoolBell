const fs = require("fs");
const db = require("better-sqlite3")("./db/schedules.db", {
  fileMustExist: true,
});

class Controller {
  constructor() {
    this.settings = this.Read();
    this.lessons = this.dbReadLessons();
  }

  __init() {
    const select = (table) => db.prepare(`select * from ${table}`).all();
    const insert = db.prepare(
      "insert into days (id, dayOfWeek, isEnabled) values (@id, @dayOfWeek, @isEnabled)"
    );
    if (select("days") == "") {
      for (let i = 0; i <= 7; i++) {
        insert.run({ id: i, dayOfWeek: i, isEnabled: 0 });
      }
    }
  }

  /**
   * Преобразует в минуты
   * @returns string list of lessons (["8 30 9 10", "9 20 10 00"])
   */
  CountLessons(firstLesson, numberOfLessons, brake) {
    brake = +brake;
    let fl = firstLesson; // First lesson
    const lessons = [firstLesson];
    fl = fl.split(" ").join(":").split(":").map(Number);
    const lduration = fl[3] + fl[2] * 60 - (fl[1] + fl[0] * 60);
    let a = fl[0] * 60 + fl[1];
    for (let i = 1; i < numberOfLessons; i++) {
      let lessonStart = a + (lduration + brake) * i;
      let lessonEnd = lessonStart + lduration;
      const start = (item) => {
        item = Math.floor(item / 60).toString();
        return item;
      };
      const end = (item) => {
        item = Math.floor(item % 60).toString();
        return item;
      };
      lessonStart = start(lessonStart) + ":" + end(lessonStart);
      lessonEnd = start(lessonEnd) + ":" + end(lessonEnd);

      lessons.push(lessonStart + " " + lessonEnd);
    }
    return lessons;
  }

  dbReadLessons() {
    let lessons = db.prepare("select * from bells").all();
    lessons = lessons.map((item) => {
      return (item = [item.timeStart, item.timeEnd].join(" "));
    });
    return (this.lessons = lessons); // я переприсваиваю this.lessons?
  }

  Read() {
    const settings = JSON.parse(fs.readFileSync("setting.json"));
    return (this.settings = settings);
  }

  dbWriteLessons(lessons) {
    // возможно стоит использовать update, но он вроде для обновления существующих записей
    db.prepare("delete from bells").run();

    const insert = db.prepare(
      "insert into bells (id, timeStart, timeEnd) values (@id, @timeStart, @timeEnd)"
    );
    lessons = lessons.map((item) => {
      return item
        .split(" ")
        .map((item) => {
          return item
            .split(":")
            .map((item) => {
              return item.length == 1 ? "0" + item : item;
            })
            .join(":");
        })
        .join(" ");
    });
    lessons.forEach((element, index) => {
      let [start, end] = element.split(" ");
      insert.run({ id: index, timeStart: start, timeEnd: end });
    });
    this.dbReadLessons();
    return lessons;
  }

  Write(settings) {
    fs.writeFileSync("setting.json", JSON.stringify(settings));
    this.Read();
  }
}

module.exports = Controller;
