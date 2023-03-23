# End to End (e2e) Test suite

## Anythink server
1. Run the Anythink server, found in the `backend` directory. Make sure the following env vars are set: `ENGINE_BASE_URL=http://localhost:3003`, `WILCO_ID=0` and the `DB connection url`.
   * With Docker: Env vars can be set in the `docker-compose.yml` file, under the `backend` service. Make sure to set hostname to make sure docker can resolve the host. `- HOSTNAME=host.docker.internal`
   * Without Docker: To test node server, go to relevant backend server,  run ```yarn install``` and `ENGINE_BASE_URL=http://localhost:3003 WILCO_ID=0 MONGODB_URI=mongodb://localhost/anythink-market yarn start`
2. Run the tests in the /tests/e2e/ using `yarn test`
   To start the app use Docker. It will start both frontend and backend, including all the relevant dependencies, and the db.