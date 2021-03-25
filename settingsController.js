const fs = require("fs");
class Controller {
  constructor() {
    this.settings = this.Read();
  }

  /**
   * Преобразует в минуты
   * @returns string list of lessons (["8 30 9 10", "9 20 10 00"])
   */
  CountLessons(firstLesson, numberOfLessons, brake) {
    brake = +brake;
    let fl = firstLesson; // First lesson
    fl = fl.split(" ").map(Number);
    const lduration = fl[3] + fl[2] * 60 - (fl[1] + fl[0] * 60);
    const lessons = [fl.join(" ")];
    let a = fl[0] * 60 + fl[1];
    for (let i = 1; i < numberOfLessons; i++) {
      let lessonStart = a + (lduration + brake) * i;
      let lessonEnd = lessonStart + lduration;
      lessonStart = Math.floor(lessonStart / 60) + " " + (lessonStart % 60);
      lessonEnd = Math.floor(lessonEnd / 60) + " " + (lessonEnd % 60);
      lessons.push(lessonStart + " " + lessonEnd);
    }
    return lessons;
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
