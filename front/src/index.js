import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode className="wrapper">
    <div className='container-fluid px-4'>
      <div className='row row-cols-auto gx-6'>
        <App className='col' dayOfWeek={1} />
        <App className='col' dayOfWeek={2} />
        <App className='col' dayOfWeek={3} />
        <App className='col' dayOfWeek={4} />
        <App className='col' dayOfWeek={5} />
        <App className='col' dayOfWeek={6} />
        <App className='col' dayOfWeek={7} />
      </div>
    </div>
  </React.StrictMode>, document.getElementById("template"));

// If you want to start measuring performance in your app, pass a function to
// log results (for example: reportWebVitals(console.log)) or send to an
// analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
