import React from "react";
import ReactDOM from "react-dom";
import { enableAllPlugins } from "immer";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { ServiceAPIProvider } from "./app/ReactContext.js";
import "./index.css";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals.js";

enableAllPlugins();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ServiceAPIProvider>
        <App />
      </ServiceAPIProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
