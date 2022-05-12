import React from "react";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import { store } from "./app/store";
import App from "./App";

test("renders learn react link", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  const linkElement = screen.getByText(
    "Click a link below to launch one of the experiments. The " +
    "experimental parameters are not setup yet and are configurable " +
    "through a file. Right now these links give a feel for what each " +
    "type of stimulus is like."
  );
  expect(linkElement).toBeInTheDocument();
});
