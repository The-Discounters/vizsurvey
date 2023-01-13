# What is VizSurvey

We created VizSurvey out of a need to have a tool with survey questions with an accompanying visualization that could be data driven for my masters thesis reasearch. I had originally investigated using survey monkey and other tools; however, they lack the ability to embed visualizations or could't find any with a REST API that would allow me to make the visualizations driven off the survey questions, so I wrote VizHub.

The application is written in react using redux. Treatments are configured in CSV format in one of the code files. The application retloads the treatments for the survey questionaire data, and renders the questions in a click through format making the data avialable to the react component that wraps the D3 visualization.

We hope you find it useful.

# Architecture

Architecture is straight forward as a React SPA with redux using react router. The next and previous buttons on each page update a status redux field and routing is driven in the react component off of the value of that field. A sing redux slice currently contains all the application logic.

# Reference

We looked at code from https://supp-exp-en.netlify.app/ for examples of how to style and implement the application.

# Setup

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Installing Dependencies

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000/dev] to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Running file server (needed for Cypress tests)

cd into the test folder and also run `npm start` in a separate terminal if you want the file server to run. This is needed to run cypres tests. If this is the first time then you need to run `npm install` from the test folder.

### `npm run build; serve -s build`

Runs the app in production mode.\
http://localhost:3000/start?participant_id=1&treatment_id=1&session_id=1 where you can edit the treatment_id value to load the treatment you want to test.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Production URLs

Below are the production urls for each treatment.

https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=1&treatment_id=1&session_id=1
https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=1&treatment_id=2&session_id=1
https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=1&treatment_id=3&session_id=1

### Local URL

http://localhost:3000?treatment_id=3&participant_id=1&session_id=3 will take you to the treatment survey.
http://localhost:3000/dev?participant_id=1&session_id=3 will take you to the list of treatments.

**This is obsoleted by the deployment in AWS**

### `npm run deploy`

Will deploy the application to github pages via gh_pages package. Then surf to https://release.d2ptxb5fbsc082.amplifyapp.com?treatment_id=2&participant_id=1&session_id=3

Change the participant_id to the value for the person taking the survey.

### Online Hosting

The survey is hosted in AWS and writes the responses to an S3 bucket. Go to

Change the participant_id to the value for the person taking the survey.

### `npm run cypress-open`

Opens cypress window to selenct and run cypress tests. Make sure to already have the app running with `npm start`.
https://docs.cypress.io/guides/guides/command-line

### `npm run cypress-run`

Runs cypress tests automatically in headless mode. Make sure to already have the app running with `npm start`.
https://docs.cypress.io/guides/guides/command-line

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### Creating animaged gif files for instruction and introduction

I used the sceenshot tool that comes with OSX to screen capture the rario button group as I selected the buttons. I converted the .mov file to an animated gif with Drop to GIF.

### links I found useful while developing

https://styled-components.com/docs/basics

https://blog.logrocket.com/13-ways-vertically-center-html-elements-css/

Gives examples of using octokit for gist
https://www.liquidweb.com/kb/little-known-ways-to-utilize-github-gists/

Articles of interest regarding review of web charting and graphing libraries.
https://cube.dev/blog/dataviz-ecosystem-2021/

This blog posts shows how to create a react app and ad D3.js to it.
https://blog.logrocket.com/using-d3-js-v6-with-react/

This post shows how to setup eslint and prettier
https://medium.com/how-to-react/config-eslint-and-prettier-in-visual-studio-code-for-react-js-development-97bb2236b31a

Flexbox post
https://css-tricks.com/snippets/css/a-guide-to-flexbox/

#### D3 articles

This post shows how to incorporate a D3 visualization as a react component
https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app
https://bost.ocks.org/mike/selection/
https://bost.ocks.org/mike/nest/
https://www.animateddata.com/articles/d3/selections/
https://www.d3indepth.com/datajoins/
https://css-tricks.com/scale-svg/
https://observablehq.com/@julesblm/svg-dominant-baseline-alignment-baseline-attributes#demoText
http://bl.ocks.org/eweitnauer/7325338
http://www.d3noob.org/2016/08/changing-text-size-for-axes-in-d3js-v4.html
https://bl.ocks.org/erikvullings/41be28677574fd484b43e91413a7e45d
https://bost.ocks.org/mike/selection/
https://observablehq.com/@philippkoytek/d3-part-3-selection-join-explained
https://www.d3indepth.com/datajoins/
https://bost.ocks.org/mike/selection/
http://using-d3js.com/01_04_create_delete_move_elements.html
https://lvngd.com/blog/building-pictogram-grids-d3js/
https://codepen.io/idan/pen/LYVGxp
https://observablehq.com/@d3/learn-d3-joins

### Code I am crediting

object2Csv - https://gist.github.com/select/0e2aa49b98ea81db7c615e6560497c41

### Notes on React

React Hooks - provides an easy way of handling the component behavior and share the component logic
Redux - is a library for managing the global application state.

- single source of truth where data is stored in object tree store
- state is read only and can only change data in store by emitting actions
- changes are made with pure functions - To update store a reducer is written as a pure function.
  Redux should be used in applications that have several features. With these features sharing chunks of the same information.

### Media Querries

https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries

### SVG

https://crashcourse.housegordon.org/D3JS-Absolute-Units.html
https://crashcourse.housegordon.org/examples/svg_units.html
https://jenkov.com/tutorials/svg/svg-transformation.html
https://www.sarasoueidan.com/blog/svg-transformations/
https://codepen.io/basiacoulter/pen/xGweXz
https://css-tricks.com/scale-svg/

### Calendar example

https://benclinkinbeard.com/d3tips/building-a-calendar-with-d3/?utm_content=bufferc1664&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer
https://codepen.io/bclinkinbeard/pen/MEZxMe

### I modeled the icon chart code on this post

https://blog.logrocket.com/13-ways-vertically-center-html-elements-css/

### Great article that explains react hooks and useEffect

https://blog.logrocket.com/guide-to-react-useeffect-hook/#:~:text=Don't%20be%20afraid%20to,need%20more%20than%20one%20effect.

Comment for checkin to force build.
