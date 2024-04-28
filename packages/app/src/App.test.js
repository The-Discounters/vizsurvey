import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import ReactTestRenderer from "react-test-renderer";
import { ServiceAPIProvider } from "./app/ReactContext.js";
import { store } from "./app/store";
import App from "./App.js";

test("renders learn react link", () => {
  ReactTestRenderer.create(
    <Provider store={store}>
      <ServiceAPIProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ServiceAPIProvider>
    </Provider>
  );
  // const linkElement = screen.getByText("Informed Consent");
  // expect(linkElement).toBeInTheDocument();
});
