import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";

export function Spinner(props) {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ width: 1, height: "100vh" }}
      >
        <CircularProgress />
        {props.text ? <Typography variant="h5">{props.text}</Typography> : ""}
      </Stack>
    </Box>
  );
}

export default Spinner;
