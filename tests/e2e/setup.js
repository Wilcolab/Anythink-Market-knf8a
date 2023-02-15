const { startServer } = require("./wilcoEngine/mockWilcoEngine");
const EventEmitter = require("events");

module.exports = async function () {
  global.eventEmitter = new EventEmitter();
  startServer();
};
