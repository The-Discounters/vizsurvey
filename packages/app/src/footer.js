import React from "react";
import { version } from "../package.json";

export const Footer = () => {
  return <div className="footer">Version: {version}</div>;
};

export default Footer;
