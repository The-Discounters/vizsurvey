# Manual Testing

To manually test the google function, form the URL like below. Be sure to URL encode the parameters.
`http://127.0.0.1:5001/vizsurvey-staging/us-central1/readExperimentConfigurations?study_ids=%5B%226685e0aae211360468e28eb4%22%2C%22xxxxxxxxxxxxxxxxxxxxxxxx%22%5D&treatment_ids=%5B2%5D&question_order_ids=%5B1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%5D`

## Links

https://cloud.google.com/functions/docs/configuring/env-var
https://firebase.google.com/docs/projects/multiprojects
https://firebase.google.com/docs/functions/config-env?gen=2nd - Talks about configuring our environment.
https://github.com/0x80/isolate-package/blob/HEAD/docs/firebase.md#firebase - interesting post to explore for refactoring deployment.
https://github.com/firebase/firebase-tools/issues/653 - Another post for deploying monrepo for firebase.
https://github.com/firebase/firebase-tools/issues/5673 - Firebase missing dependency error during deployment post.
https://firebase.google.com/docs/functions/get-started?gen=2nd - Tutorial on deploying first function.
https://firebase.google.com/docs/functions/handle-dependencies?lang=nodejs - Document on how to handle dependencies.
https://stackoverflow.com/questions/54458795/firebase-functions-local-file-dependencies - Post on file: for local dependencies.
https://firebase.google.com/docs/cli - Firebase CLI reference.
https://firebase.google.com/docs/functions/config-env?gen=2nd#environment_configuration - Document on how to configure your environment.
https://firebase.google.com/docs/projects/multiprojects - Document on configuring multiple environments.
https://cloud.google.com/functions/docs/writing/specifying-dependencies-nodejs - Google Cloud document on specifying dependencies.
https://cloud.google.com/functions/docs/configuring/env-var - Google cloud document on specifying environment variables.
https://github.com/hedgepigdaniel/webpack-cloud-functions/ - possible webpack refactor for deploying.
https://medium.com/@mailtoankitgupta/firebase-functions-with-babel-typescript-fdf04306aec7 - recent post on setting up babel for firebase function deploy.
https://firebase.google.com/docs/web/module-bundling - google docs on using module bunders.
https://firebase.google.com/docs/projects/api-keys - Great document that explains firebase API keys. Basically they identify an application and are OK to embed in the app.
https://firebase.google.com/docs/rules/manage-deploy - Document that explains how to configure firebase security rules.
https://firebase.google.com/docs/web/setup - Goes over how to setup firebase in your javascript application (client side setup).
https://github.com/firebase/functions-samples - Firebase sample projects.
