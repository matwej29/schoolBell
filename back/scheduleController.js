const schedule = require('./schedule.js');

class Controller {
  async day(req, res) {
    const dayOfWeek = req.query.dayOfWeek;
    const day = await schedule.Lesson.findAll({
      where: {
        dayOfWeek: dayOfWeek,
      },
    });
    
    res.send(day);
  }

  async days(req, res) {
    let days = await schedule.Lesson.findAll();

    res.send(days);
  }

  async saveDay(req, res) {
    const dayOfWeek = req.query.dayOfWeek;
    await schedule.Lesson.destroy({ where: { dayOfWeek: dayOfWeek } });
    console.log(req.body.day);
    req.body.day.forEach(async (element) => {
      await schedule.Lesson.upsert(element); // а где insert ?
    });
    res.send(true);
  }
}

module.exports = Controller;
