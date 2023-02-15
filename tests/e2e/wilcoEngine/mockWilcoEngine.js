const express = require("express");
const asyncHandler = require("express-async-handler");
const { dispatch } = require("./wilcoEngineEvents");

const PORT = 3003;
let server = null;

const app = express();
app.use(express.json());

app.post(
  "/users/:id/event",
  asyncHandler(async (req, res) => {
    dispatch(req?.body?.event);
    res.json({});
  })
);

const startServer = () => {
  server = app.listen(PORT);
};

const stopServer = () => {
  server.close();
};

module.exports = { app, startServer, stopServer };
