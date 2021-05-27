import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
const config = require("./config.json");

const Lesson = ({ timeStart, timeEnd, onChange }) => {
  const onTimeStartChange = (e) => {
    onChange({ timeStart: e.target.value, timeEnd });
  };
  const onTimeEndChange = (e) => {
    onChange({ timeStart, timeEnd: e.target.value });
  };
  return (
    <td>
      <input
        type='time'
        name='timeStart'
        value={timeStart}
        onChange={onTimeStartChange}
      ></input>
      <input
        type='time'
        name='timeEnd'
        value={timeEnd}
        onChange={onTimeEndChange}
      ></input>
    </td>
  );
};

const lessonsSave = async (data, dayOfWeek) => {
  const response = await fetch(
    `http://${config.adress}/saveDay?dayOfWeek=${dayOfWeek}`,
    {
      headers: {
        Accept: 'application/json, *.*',
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: 'POST',
      body: JSON.stringify({ day: data }),
    }
  );
  return response;
};

const getDay = async (day) => {
  let response = await fetch(`http://${config.adress}/day?dayOfWeek=${day}`, {
    headers: {
      Accept: 'application/json, *.*',
      'Content-Type': 'application/json; charset=utf-8',
    },
    method: "GET",
    // mode: "no-cors"
  });

  if (response.ok) {
    return response.json();
  }
};

const App = (dayOfWeek) => {
  const [date, setDate] = React.useState(dayOfWeek.dayOfWeek);
  const [schedule, setSchedule] = React.useState([]);
  React.useEffect(() => {
    const pageData = async () => {
      setSchedule(await getDay(date));
    };
    pageData();
  }, [date]);
  const onItemChange = (index, newValue) => {
    const newSchedule = [
      ...schedule.slice(0, index),
      { ...schedule[index], ...newValue },
      ...schedule.slice(index + 1),
    ];
    setSchedule(newSchedule);
  };
  const addItem = () => {
    setSchedule(
      schedule.concat({
        dayOfWeek: date,
        timeStart: undefined,
        timeEnd: undefined,
      })
    );
  };

  const deleteItem = (index) => {
    setSchedule([...schedule.slice(0, index), ...schedule.slice(index + 1)]);
  };

  return (
    <div>
      <h3>{date}</h3>
      <button onClick={() => lessonsSave(schedule, date)}>Сохранить</button>
      <button onClick={() => addItem()}>Добавить</button>
      <table>
        <tbody>
          {schedule.map((item, index) => (
            <tr key={item.id}>
              <Lesson
                timeStart={item.timeStart}
                timeEnd={item.timeEnd}
                onChange={(newValue) => {
                  onItemChange(index, newValue);
                }}
              />
              <td>
                <button onClick={() => deleteItem(index)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
