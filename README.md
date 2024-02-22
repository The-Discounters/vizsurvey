# What is VizSurvey

We created VizSurvey out of a need to have a tool with survey questions with an accompanying visualization that could be data driven for our masters thesis reasearch. We originally investigated using survey monkey and other online survey tools; however, they lacked the ability to embed visualizations and we could't find any with a REST API that would allow the visualizations to be driven off the survey questions, so we wrote VizSurvey.

The application is written in javascript with react using redux and uses firestore to retrieve treatment definitions, store survey answers, and assign survey treatments across participants. The application loads the treatments for the survey questionaire data, and renders the questions in a click through format making the data avialable to the react component that wraps the D3 visualization. The app connects
to a google function to have treatment questions assigned to the participant and calls another google function to record answers.

We hope you find it useful.

# Architecture

Architecture is straight forward as a React SPA with redux using react router. The next buttons on each page update a status redux field and routing is driven in the react component off of the value of that field. A single redux slice currently contains all the application logic. We integrated the application with Prolific and treatment configurations and survey results are read from and written to firestore.

# Reference

We looked at code from https://supp-exp-en.netlify.app/ for examples of how to style and implement the application.

# Setup

### Create your instance in firestore for staging and production

1. Create an new project in firebase console.
2. Navigate to Project Settings->Service accounts tab. Click on Generate new private key. Confirm and the admin credentials json file will download to you downloads folder. I renamed mine to something shorter (i.e. admin-credentials-production.json). Copy the file to the packages/firebase/functions folder. This file contains your admin credentials which have access to all firebase services (like superuser) so keep it somewhere safe.
3. Create a new app in the project above and copy the values out of the firebaseConfig code shown to the staging or production .env file depending on what environment they are for (i.e. .env.prod for production).
4. Create the firestore database. I chose to create the rules in test mode which has open access rules for 30 days so that I could get the deployment working. The firestore database was created in datastore mode, which is backward compatible with Firebase real time database. Since we don't have to maintain backward compatiblity, go into the console and switch to native mode. Then you can access the database from the firestore console (otherwise you have to access it from the google cloud console since datastore mode databases can only be accessed from that tool).
5. Open a terminal session and run `source ./setenv<environment>.sh` i.e. setenvstaging.sh where <environment> is the environment you want to load data into. Then `cd scripts` and `./refresh.sh`.
6.

### Download firestore credentials files

Download the credential files from the firestore instances you created above and put them in files named as below. Environment
variables set via the scripts setenvdev.sh, setenvprod.sh, and setenvstating.sh will tell the firebase SDK on how to find the files.
admin-credentials-dev.json
admin-credentials-prod.json

### Create .env file

.env, .env.local, .env.dev, .env.prod, .env.staging where .env overrides other .env files.

Create a .env.dev, .env.prod, and .env.staging file in packages/app so that the web app can locate settings.
Modify the settings to the appropriate values.

```
REACT_APP_ENV=<development or production>
REACT_APP_VERSION=<product version>
REACT_APP_FIREBASE_SERVER_URL=<from firebaseConfig template code in web app settings in firebase console>
REACT_APP_FIREBASE_API_KEY=<from firebaseConfig template code in web app settings in firebase console>
REACT_APP_FIREBASE_AUTH_DOMAIN=<from firebaseConfig template code in web app settings in firebase console>
REACT_APP_FIREBASE_PROJECT_ID=<from firebaseConfig template code in web app settings in firebase console>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<from firebaseConfig template code in web app settings in firebase console>
REACT_APP_FIREBASE_APP_ID=<from firebaseConfig template code in web app settings in firebase console>
REACT_APP_FIREBASE_MEASUREMENT_ID=<from firebaseConfig template code in web app settings in firebase console>
REACT_APP_FULLSCREEN=enabled=<enabled or empty>
REACT_APP_PAYMENT_AMOUT=<payment amount including currency symbol and I needed a slash before symbol i.e. \$3>
REACT_APP_PROLIFIC_CODE=<prolific code>
REACT_APP_RESEARCH_TITLE=Choices About Money
REACT_APP_RESEARCHER_NAMES=<researcher names that show up on consent form>
REACT_APP_CONTACT_NAME=<consent contact name>
REACT_APP_CONTACT_EMAIL=<consent contact email>
REACT_APP_CONTACT_PHONE=<consent contact phone>
REACT_APP_SPONSOR_NAME=<consent sponsor name>
REACT_APP_SPONSOR_EMAIL=<consent sponsor email>
REACT_APP_SPONSOR_PHONE=<consent sponsor phone>
REACT_APP_IRB_NAME=<Institutional Review Board (IRB) contact name>
REACT_APP_IRB_EMAIL=<IRB contact email>
REACT_APP_IRB_PHONE=<IRB contact phone>
REACT_APP_HPA_NAME=<Human protection admin contact name>
REACT_APP_HPA_EMAIL=<Human protection admin contact email>
REACT_APP_HPA_PHONE=<Human protection admin contact phone>
```

From https://stackoverflow.com/questions/42458434/how-to-set-build-env-variables-when-running-create-react-app-build-script
npm start will set REACT_APP_NODE_ENV to development, and so it will automatically use the .env.development file, and npm run build sets REACT_APP_NODE_ENV to production, and so it will automatically use .env.production. Values set in these will override the values in your .env.

### Installing Learna

See https://lerna.js.org/.
TODO add better instructions here.

### Installing yarn

See https://yarnpkg.com/corepack. Yarn wants to be installed via corepack so it's per project and not global.

### Installing Dependencies

In the root folder of the project run

```console
yarn install
```

It's not clear to me if you have to run yarn install in each mono repo (folder under packages). Or maybe this is where lerna is relevant.

Open a bash terminal and run

```console
source ./setenvdev.sh
```

Then start the firebase emulator by running

```console
cd packages/firebase/functions
yarn emulator:start
```

The emulator should start and run firestore and functions emulation. You should be able to browse to http://127.0.0.1:4000/
and see the emulator admin screen. You will see initial data seeded since the emulator was started with seeding data from the
packages/firebase/import folder.

Create another bash shell and run

```console
source ./setenvdev.sh
```

You should be able to run the unit tests for functions with

```console
cd pacakges/firebase/functions
yarn test
```

And if you want to run the firebase-shared project unit tests, open another bash terminal and run

```console
source ./setenvdev.sh
cd pacakges/firebase/firebase-shared
yarn test
```

To run the web app create a bash terminal and run

```console
cd packages/app
yarn run
```

A browswer should launch and then go to [https://localhost:3000/dev] and you will see a list of predefined
experiments you can launch into on the app.

If you want to re-import the data, go to the emulator and click the "Clear all data" button. Then
open a bash shell and run

```console
source ./setenvdev.sh
cd scripts
./refresh_exp_config.ps1
```

The script will delete existing data and then re-import from the csv files and convert the primary/foreign key references
to reference types.

You can also run the command below to install the CLI globally so you can run it at a command prompt

```console
npm install -g
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

Runs the app in the development mode.\
Open [https://localhost:3000/dev] to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

To run using .env.production use

### Running file server (needed for Cypress tests)

THIS IS GOING TO BE DELETED SINCE DATA IS READ FROM AND WRITTEN TO GOOGLE FUNCTIONS.
cd into the test folder and also run `yarn start` in a separate terminal if you want the file server to run. This is needed to run cypres tests. If this is the first time then you need to run `yarn install` from the test folder.

### `yarn build; serve -s build`

Runs the app in production mode.\
https://localhost:3000/start?participant_id=1&study_id=testbetween&session_id=1.

### `yarn build`

From the pacakges/app folder Builds the app for production to the `build` folder.\
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

https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=1&session_id=4&study_id=5
https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=1&session_id=4&study_id=5
https://release.d2ptxb5fbsc082.amplifyapp.com/start?participant_id=1&session_id=4&study_id=5

### Local URL

https://localhost:3000?participant_id=1&session_id=3&study_id=betweensubject will take you to the treatment survey.

### `yarn cypress-open`

Opens cypress window to selenct and run cypress tests. Make sure to already have the app running with `yarn start`.
https://docs.cypress.io/guides/guides/command-line

### `yarn cypress-run`

Runs cypress tests automatically in headless mode. Make sure to already have the app running with `yarn start`.
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

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### Creating animaged gif files for instruction and introduction

I used the sceenshot tool that comes with OSX to screen capture the rario button group as I selected the buttons. I converted the .mov file to an animated gif with Drop to GIF.

Yahel's instructions with a separate tool
https://gist.github.com/SheldonWangRJT/8d3f44a35c8d1386a396b9b49b43c385

Solution
download HomeBrew

```
$brew install ffmpeg
$brew install gifsicle
$ffmpeg -i in.mov -pix_fmt rgb8 -r 10 output.gif && gifsicle -O3 output.gif -o output.gif
```

`&& gifsicle` ended up not being installed, but it seems to only optimize the gif which I did not need

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
