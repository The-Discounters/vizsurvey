import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFullScreenHandle } from "react-full-screen";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import { Button, Grid, Typography } from "@material-ui/core";
import {
  writeAnswers,
  selectAllQuestions,
  setParticipantId,
  thankYouShownTimestamp,
} from "../features/questionSlice";
import { FileIOAdapter } from "../features/FileIOAdapter";
import { dateToState } from "../features/ConversionUtil";

const styles = {
  root: {
    flexGrow: 1, // flex:1, padding: 5,height: "100%", width: "100%"
    margin: 20,
  },
  button: { marginTop: 10, marginBottom: 10 },
  container: { display: "flex", flexWrap: "wrap" },
  textField: { marginLeft: 10, marginRight: 10, width: 200 },
  label: { margin: 0 },
};

const ThankYou = () => {
  useEffect(() => {
    dispatch(thankYouShownTimestamp(dateToState(DateTime.utc())));
  }, []);

  const handle = useFullScreenHandle();
  handle.exit();

  const uuid = uuidv4();

  const dispatch = useDispatch();
  dispatch(setParticipantId(uuid));
  const answers = useSelector(selectAllQuestions);
  const io = new FileIOAdapter();
  const csv = io.convertToCSV(answers);
  dispatch(writeAnswers(csv));

  const partcipantCodeText = (showParticipantCode) => {
    if (showParticipantCode) {
      return (
        <React.Fragment>
          <Typography paragraph>
            Your unique ID is:&nbsp;
            <input
              type="text"
              value={uuid}
              style={{ width: "340px" }}
              readOnly
            />
            &nbsp;
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(uuid);
              }}
            >
              Copy
            </Button>
            . Please go back to Amazon Turk and present this unique ID in the
            form.
          </Typography>
        </React.Fragment>
      );
    } else {
      return "";
    }
  };

  return (
    <React.Fragment>
      <Grid container style={styles.root}>
        <Grid item xs={12}>
          <Typography variant="h4">Thank You!</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
          <Typography paragraph>
            You have completed the survey and your answers have been submitted.
            Thank you for taking this survey!
          </Typography>
          {partcipantCodeText(false)}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default ThankYou;
