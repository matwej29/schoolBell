import './App.css';
import React from 'react';
// import ReactDOM from 'react-dom';
const config = require("./config.json");

const Lesson = ({timeStart, timeEnd, onChange, id}) => {
  const onTimeStartChange = (e) => {
    onChange({timeStart: e.target.value, timeEnd});
  };
  const onTimeEndChange = (e) => {
    onChange({timeStart, timeEnd: e.target.value});
  };
  return (
    <>
      <th scope='row'>{id}</th>
      <td>
        <input
          className='form-control'
          type='time'
          name='timeStart'
          value={timeStart}
          onChange={onTimeStartChange}></input>
      </td>
      <td>
        <input
          className='form-control'
          type='time'
          name='timeEnd'
          value={timeEnd}
          onChange={onTimeEndChange}></input>
      </td>
    </>
  );
};

const lessonsSave = async(data, dayOfWeek) => {
  const response = await fetch(`http://${config.adress}/saveDay?dayOfWeek=${dayOfWeek}`, {
    headers: {
      Accept: 'application/json, *.*',
      'Content-Type': 'application/json; charset=utf-8'
    },
    method: 'POST',
    body: JSON.stringify({day: data})
  });
  return response;
};

const getDay = async(day) => {
  let response = await fetch(`http://${config.adress}/day?dayOfWeek=${day}`, {
    headers: {
      Accept: 'application/json, *.*',
      'Content-Type': 'application/json; charset=utf-8'
    },
    method: "GET",
    // mode: "no-cors"
  });

  if (response.ok) {
    return response.json();
  }
};

const App = (dayOfWeek) => {
  const [date,
    setDate] = React.useState(dayOfWeek.dayOfWeek);
  const [schedule,
    setSchedule] = React.useState([]);
  React.useEffect(() => {
    const pageData = async() => {
      setSchedule(await getDay(date));
    };
    pageData();
  }, [date]);
  const onItemChange = (index, newValue) => {
    const newSchedule = [
      ...schedule.slice(0, index), {
        ...schedule[index],
        ...newValue
      },
      ...schedule.slice(index + 1)
    ];
    setSchedule(newSchedule);
  };
  const addItem = () => {
    setSchedule(schedule.concat({dayOfWeek: date, timeStart: undefined, timeEnd: undefined}));
  };

  const deleteItem = (index) => {
    setSchedule([
      ...schedule.slice(0, index),
      ...schedule.slice(index + 1)
    ]);
  };

  const DAYS_OF_WEEK = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье"
  ]

  return (
    <div className='card card-outline card-primary'>
      <div className='card-header'>{DAYS_OF_WEEK[date - 1]}</div>
      <div className='card-body'>
        <div className='row row-cols-auto'>
          <button className='btn btn-secondary me-1' onClick={() => lessonsSave(schedule, date)}>Сохранить</button>
          <button className='btn btn-secondary' onClick={() => addItem()}>Добавить</button>
        </div>
        
        <table className='table'>
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
                }}/>
                <td>
                  <button className='btn btn-danger bi bi-x-lg' onClick={() => deleteItem(index)}></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
