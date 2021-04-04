// model
const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: __dirname + "/db/schedules.db",
});

class Lesson extends Model {}
Lesson.init(
  {
    dayOfWeek: {
      type: DataTypes.INTEGER,
    },
    timeStart: {
      type: DataTypes.TIME,
    },
    timeEnd: {
      type: DataTypes.TIME,
    },
  },
  {
    sequelize,
    modelName: "Lesson",
    timestamps: false,
    tableName: "bells",
  }
);

module.exports = sequelize.models;
