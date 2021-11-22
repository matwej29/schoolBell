import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import ReactDOM from 'react-dom';
const host = 'http://localhost:8080';

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

const getSchedule = async () => {
  const response = await (
    await fetch(`${host}/get_lessons`, { method: 'GET' })
  ).json();
  return response;
};

const useLessons = () => {
  const [lessons, setLessons] = useState([]);
  useEffect(() => getSchedule().then((res) => setLessons(res)), []);
  const getDay = (day) => lessons.filter((lesson) => lesson?.dayOfWeek === day);

  const setDay = (schedule) => {
    setLessons([
      ...lessons.filter(
        (lesson) => lesson.dayOfWeek !== schedule[0]?.dayOfWeek
      ),
      ...schedule,
    ]);
  };

  const saveLessons = () => {
    fetch(`${host}/write_lessons`, {
      method: 'POST',
      body: JSON.stringify(lessons),
    });
  };

  return { lessons, setLessons, getDay, setDay, saveLessons };
};

const Lesson = ({ timeStart, timeEnd, onChange, id }) => {
  const onTimeStartChange = (e) => {
    onChange({ timeStart: e.target.value, timeEnd });
  };
  const onTimeEndChange = (e) => {
    onChange({ timeStart, timeEnd: e.target.value });
  };
  return (
    <>
      <th scope="row">{id}</th>
      <td>
        <input
          className="form-control"
          type="time"
          name="timeStart"
          value={timeStart}
          onChange={onTimeStartChange}
        />
      </td>
      <td>
        <input
          className="form-control"
          type="time"
          name="timeEnd"
          value={timeEnd}
          onChange={onTimeEndChange}
        />
      </td>
    </>
  );
};

const LessonsDay = ({ dayOfWeek, preInitLessons }) => {
  const [date] = useState(dayOfWeek);
  const { lessons, setLessons, getDay } = preInitLessons;
  const [schedule, setSchedule] = useState([]);
  useEffect(() => {
    const pageData = () => {
      setSchedule(getDay(date));
    };
    pageData();
  }, [lessons, date]);
  const addItem = () => {
    const prePreviousItem = schedule[schedule.length - 2] ?? {
      timeStart: '00:00',
      timeEnd: '00:00',
    };
    const previousItem = schedule[schedule.length - 1] ?? {
      id: 0,
      timeStart: '08:00',
      timeEnd: '08:40',
    };
    setLessons(
      lessons.concat({
        id: lessons[lessons.length - 1]?.id + 1 || 0,
        dayOfWeek: date,
        timeStart: previousItem.timeStart,
        timeEnd: previousItem.timeEnd,
      })
    );
  };

  const deleteItem = (id) => {
    const index = lessons.findIndex((lesson) => lesson.id === id);
    setLessons([...lessons.slice(0, index), ...lessons.slice(index + 1)]);
  };

  const WEEKDAYS = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье',
  ];

  return (
    <div className="card card-outline card-primary">
      <div className="card-header">{WEEKDAYS[date - 1]}</div>
      <div className="card-body">
        <div className="row row-cols-auto">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => addItem()}
          >
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
            {getDay(dayOfWeek).map((item, index) => (
              <tr key={item.id}>
                <Lesson
                  id={index + 1}
                  timeStart={item.timeStart}
                  timeEnd={item.timeEnd}
                  onChange={(newValue) => {
                    onItemChange(
                      lessons.findIndex((lesson) => lesson.id === item.id),
                      newValue,
                      lessons,
                      setLessons
                    );
                  }}
                />
                <td>
                  <button
                    type="button"
                    className="btn btn-danger bi bi-x-lg"
                    onClick={() => deleteItem(item.id)}
                  >
                    {' '}
                  </button>
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
  const preInitLessons = useLessons();

  return (
    <>
      <Link to="/settings" className="btn btn-secondary me-1">
        Settings
      </Link>
      <div className="container-fluid px-4">
        <button
          type="button"
          className="btn btn-secondary me-1"
          onClick={() => preInitLessons.saveLessons()}
        >
          Сохранить
        </button>
        {/* prettier-ignore */}
        <div className="row row-cols-auto gx-6">
          <LessonsDay className="col" dayOfWeek={1} preInitLessons={preInitLessons} />
          <LessonsDay className="col" dayOfWeek={2} preInitLessons={preInitLessons} />
          <LessonsDay className="col" dayOfWeek={3} preInitLessons={preInitLessons} />
          <LessonsDay className="col" dayOfWeek={4} preInitLessons={preInitLessons} />
          <LessonsDay className="col" dayOfWeek={5} preInitLessons={preInitLessons} />
          <LessonsDay className="col" dayOfWeek={6} preInitLessons={preInitLessons} />
          <LessonsDay className="col" dayOfWeek={7} preInitLessons={preInitLessons} />
        </div>
      </div>
    </>
  );
};

export default Schedule;
