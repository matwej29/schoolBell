const schedule = require('./schedule.js');

class Controller {
  async day(req, res) {
    const dayOfWeek = req.query.dayOfWeek ?? 0;
    const day = await schedule.Lesson.findAll({
      where: {
        dayOfWeek: dayOfWeek,
      },
    });
    
    res.send(day);
  }

  async days(req, res) {
    let days = await schedule.Lesson.findAll();

    res.send(JSON.stringify(days));
  }

  async saveDay(req, res, next) {
    const dayOfWeek = req.query.dayOfWeek;
    await schedule.Lesson.destroy({ where: { dayOfWeek: dayOfWeek } });
    console.log(req.body.day);
    req.body.day.forEach(async (element) => {
      await schedule.Lesson.upsert(element);
    });
    res.send(true);
    next();
  }

  async getDays(){
    const days = await schedule.Lesson.findAll();
    return days
  }
}

module.exports = Controller;
