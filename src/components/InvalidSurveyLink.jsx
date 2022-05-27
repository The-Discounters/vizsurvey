import React from "react";
import { Grid, Typography } from "@material-ui/core";

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

const InvalidSurveyLink = () => {
  return (
    <React.Fragment>
      <Grid container style={styles.root}>
        <Grid item xs={12}>
          <Typography variant="h4">Error!</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
          <Typography paragraph>
            You have been provided an invalid survey link. Please click
            <a
              href={`mailto:pncordone@wpi.edu?subject=!!!Invlaid survey link!!!t&body=${encodeURIComponent(
                "TODO put in invalid survey email text."
              )}`}
            >
              &nbsp;here&nbsp;
            </a>
            to send an email to the administrator reporting this error.
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default InvalidSurveyLink;
