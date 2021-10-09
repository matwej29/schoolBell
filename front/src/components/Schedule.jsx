// import './Lesson.css';
import React from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
// import ReactDOM from 'react-dom';
const socket = io("localhost:8080");
const lessons = {
  lessons: [],
  get: (day) => {
    this.lessons.filter((lesson) => lesson.id === day);
  },
};
socket.on("lessons", (res) => lessons.lessons = res);

const Lesson = ({ timeStart, timeEnd, onChange, id }) => {
  const onTimeStartChange = (e) => {
    onChange({ timeStart: e.target.value, timeEnd });
  };
  const onTimeEndChange = (e) => {
    onChange({ timeStart, timeEnd: e.target.value });
  };
  return (
    <React.Fragment>
      <th scope="row">{id}</th>
      <td>
        <input
          className="form-control"
          type="time"
          name="timeStart"
          value={timeStart}
          onChange={onTimeStartChange}
        ></input>
      </td>
      <td>
        <input
          className="form-control"
          type="time"
          name="timeEnd"
          value={timeEnd}
          onChange={onTimeEndChange}
        ></input>
      </td>
    </React.Fragment>
  );
};

const lessonsSave = (data, dayOfWeek) => {
  socket.emit("write_lessons", lessons);
};

const getDay = (day) => {
  return lessons.get(day);
};

const LessonsDay = (dayOfWeek) => {
  const [date, setDate] = React.useState(dayOfWeek.dayOfWeek);
  const [schedule, setSchedule] = React.useState([]);
  React.useEffect(() => {
    const pageData = async () => {
      setSchedule(getDay(date));
    };
    pageData();
  }, [date]);
  const onItemChange = (index, newValue) => {
    const newSchedule = [
      ...schedule.slice(0, index),
      {
        ...schedule[index],
        ...newValue,
      },
      ...schedule.slice(index + 1),
    ];
    setSchedule(newSchedule);
  };
  const addItem = () => {
    const prePreviousItem = schedule[schedule.length - 2];
    const previousItem = schedule[schedule.length - 1] ?? {
      id: 0,
      timeStart: "08:00",
      timeEnd: "08:00",
    };
    setSchedule(
      schedule.concat({
        id: previousItem.id + 1,
        dayOfWeek: date,
        timeStart: previousItem.timeStart,
        timeEnd: previousItem.timeEnd,
      })
    );
  };

  const deleteItem = (index) => {
    setSchedule([...schedule.slice(0, index), ...schedule.slice(index + 1)]);
  };

  const DAYS_OF_WEEK = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

  console.log(schedule);
  return (
    <div className="card card-outline card-primary">
      <div className="card-header">{DAYS_OF_WEEK[date - 1]}</div>
      <div className="card-body">
        <div className="row row-cols-auto">
          <button
            className="btn btn-secondary me-1"
            onClick={() => lessonsSave(schedule, date)}
          >
            Сохранить
          </button>
          <button className="btn btn-secondary" onClick={() => addItem()}>
            Добавить
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Начало</th>
              <th scope="col">Конец</th>
              <th scope="col">-</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={item.id}>
                <Lesson
                  id={index + 1}
                  timeStart={item.timeStart}
                  timeEnd={item.timeEnd}
                  onChange={(newValue) => {
                    onItemChange(index, newValue);
                  }}
                />
                <td>
                  <button
                    className="btn btn-danger bi bi-x-lg"
                    onClick={() => deleteItem(index)}
                  ></button>
                  {/* <p>{item.id}</p> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Schedule = () => {
  return (
    <React.Fragment>
      <Link to="/settings">Settings without style</Link>
      <div className="container-fluid px-4">
        <div className="row row-cols-auto gx-6">
          <LessonsDay className="col" dayOfWeek={1} />
          <LessonsDay className="col" dayOfWeek={2} />
          <LessonsDay className="col" dayOfWeek={3} />
          <LessonsDay className="col" dayOfWeek={4} />
          <LessonsDay className="col" dayOfWeek={5} />
          <LessonsDay className="col" dayOfWeek={6} />
          <LessonsDay className="col" dayOfWeek={7} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Schedule;
