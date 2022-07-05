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

  const linkElement = screen.getByText("<b>Money Earlier or Later?</b>");
  expect(linkElement).toBeInTheDocument();
});
