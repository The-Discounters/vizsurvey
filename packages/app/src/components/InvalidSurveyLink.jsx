import React from "react";
import { Grid, Typography } from "@mui/material";

const InvalidSurveyLink = () => {
  return (
    <React.Fragment>
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
      >
        <Grid item xs={12}>
          <Typography variant="h4">Error!</Typography>
          <hr
            style={{
              color: "#ea3433",
              backgroundColor: "#ea3433",
              height: 4,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" paragraph>
            There has been an error in the application. You may have been
            provided an invalid survey link. Please click&nbsp;
            <a
              href={`mailto:pncordone@wpi.edu?subject=[Vizsurvey Error]&body=${encodeURIComponent(
                "We appologize.  There was an error with the survey application.  If you click send on this email, it will inform us of the error which we appreciate; however, it will not be an aynonomous email since it will be sent from your email client."
              )}`}
            >
              here
            </a>
            &nbsp;to send an email to the administrator reporting this error and
            we will fix the problem and respond back.
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default InvalidSurveyLink;
