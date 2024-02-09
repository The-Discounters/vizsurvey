import React from "react";
import { subscribe } from "../features/serviceAPI.js";

export const Context = React.createContext();

export const ServiceAPIProvider = ({ children }) => {
  const [state, updateState] = React.useState("false");

  // Subscribe to API
  React.useEffect(() => {
    subscribe(updateState);
  }, []);

  return <Context.Provider value={state}>{children}</Context.Provider>;
};
