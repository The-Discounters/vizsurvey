import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);

  // without passing 2nd parameter, useEffect is equivalent to componentDidUpdate
  // when we pass the 2nd parameter requested, useEffect gets called when requested changes in value
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, [url]);

  return data;
};

export default useFetch;
