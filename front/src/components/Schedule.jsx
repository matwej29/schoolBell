import React, { useRef, useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
// import ReactDOM from 'react-dom';
const host = "http://localhost:8080";
console.log(io(host)); // коннектится
const useSocket = () => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = io(host);
    console.log(ref.current); // не коннектится
    return () => {
      ref.current.disconnect();
    };
  }, []);

  const addListener = useCallback(
    (event, handler) => {
      if (!ref.current) return;
      ref.current = ref.current.on(event, handler);
    },
    [ref.current]
  );

  return { socket: ref.current, addListener };
};

const onItemChange = (index, newValue, currentObject, setObject) => {
  const newObject = [
    ...currentObject.slice(0, index),
    {
      ...currentObject[index],
      ...newValue,
    },
    ...currentObject.slice(index + 1),
  ];
  setObject(newObject);
};

// const week = () => {
const [lessons, setLessons] = useState([]);

useEffect(() => {
  const { socket, addListener } = useSocket();
  setLessons(addListener("lessons"));

  // return
}, [addListener, socket]);

const getDay = (day) => {
  return lessons.filter((lesson) => lesson.dayOfWeek === day);
};

const setDay = (schedule) => {
  setLessons(
    lessons
      .filter((lesson) => {
        lesson.dayOfWeek !== schedule[0].dayOfWeek;
      })
      .push(schedule)
  );
};

const lessonsSave = () => {
  socket.emit("write_lessons", lessons);
};
// };

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

const LessonsDay = (dayOfWeek) => {
  const [date, setDate] = useState(dayOfWeek.dayOfWeek);
  const [schedule, setSchedule] = useState([]);
  useEffect(() => {
    const pageData = () => {
      setSchedule(getDay(date));
    };
    pageData();
  }, [date]);
  useEffect(() => {
    setDay(schedule);
  }, [schedule]);
  const addItem = () => {
    const prePreviousItem = schedule[schedule.length - 2] ?? {
      timeStart: "00:00",
      timeEnd: "00:00",
    };
    const previousItem = schedule[schedule.length - 1] ?? {
      id: 0,
      timeStart: "08:00",
      timeEnd: "08:40",
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

  const WEEKDAYS = [
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
      <div className="card-header">{WEEKDAYS[date - 1]}</div>
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
                    onItemChange(index, newValue, schedule, setSchedule);
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
