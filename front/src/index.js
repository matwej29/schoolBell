import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Schedule from "./components/Schedule";
import Settings from "./components/Settings";

ReactDOM.render(
  <React.StrictMode className="wrapper">
    <BrowserRouter>
      <Switch>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route path="/">
          <Schedule />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("template")
);

