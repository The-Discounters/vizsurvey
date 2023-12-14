# Environment variables and the emulator

If you want to run the emulator be sure the environment variable
FIRESTORE_EMULATOR_HOST is set to the IP and port of the emulator
(i.e. export FIRESTORE_EMULATOR_HOST="127.0.0.1:8080") in the
shell that the unit tests are launched from. This tells the SDK
to intecept calls and send them to the emulator.

# Running unit tests

To run the unit tests with the emulator.

1. Open a bash shell and make sure the GOOGLE_APPLICATION_CREDENTIALS
   is set to point to your admin-credentials.json file. This tells
   the emulator where to get creds to send non emulated calls to the
   live firebase instance.
2. Run the emulator with:
   `yarn run emulator:start`
3. Set FIRESTORE_EMULATOR_HOST in the shell to tell the SDK what IP
   address and port the emulator is running on. You can run
   `source ../../../setenv.sh`
4. Run the command below to run the tests:
   `yarn run test`
5. If you want to shut the emulator off and run the tests on the live
   firestore instance, run:
   `unset FIRESTORE_EMULATOR_HOST`

# Reference

See the links below for information on how I got all this running.
https://firebase.google.com/docs/rules/unit-tests
https://firebase.google.com/docs/reference/emulator-suite/rules-unit-testing/rules-unit-testing.rulestestenvironment
https://firebase.google.com/docs/emulator-suite/connect_firestore
https://firebase.google.com/docs/web/modular-upgrade
