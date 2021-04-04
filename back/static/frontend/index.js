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
        type="time"
        name="timeStart"
        value={timeStart}
        onChange={onTimeStartChange}
      ></input>
      <input
        type="time"
        name="timeEnd"
        value={timeEnd}
        onChange={onTimeEndChange}
      ></input>
    </td>
  );
};

const buttons = [
  { name: "day1", disabled: false },
  { name: "day2", disabled: false },
  { name: "day3", disabled: false },
  { name: "day4", disabled: false },
  { name: "day5", disabled: false },
  { name: "day6", disabled: false },
  { name: "day7", disabled: false },
  { name: "settings", disabled: false },
];

const lessonsSave = async (data, dayOfWeek) => {
  const response = await fetch(`/saveDay?dayOfWeek=${dayOfWeek}`, {
    headers: {
      Accept: "application/json, *.*",
      "Content-Type": "application/json; charset=utf-8",
    },
    method: "POST",
    body: JSON.stringify({ day: data }),
  });
  return response;
};

const getDay = async (day) => {
  let response = await fetch(`/day?dayOfWeek=${day}`);

  if (response.ok) {
    return response.json();
  }
};

// const menuSelect = (name) => {
//   alert(name);
//   switch (name) {
//     case "settings":
//       // render
//       break;

//     default:
//       break;
//   }
// };

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
const renderDay = () => {
  ReactDOM.render(
    <div>
      <App dayOfWeek={1} />
      <App dayOfWeek={2} />
      <App dayOfWeek={3} />
      <App dayOfWeek={4} />
      <App dayOfWeek={5} />
      <App dayOfWeek={6} />
      <App dayOfWeek={7} />
    </div>,
    document.getElementById("template")
  );
};

renderDay();
