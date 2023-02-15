const { expect } = require("@jest/globals");
const { sleep } = require("../../utils");
const { subscribe, unsubscribe } = require("./wilcoEngineEvents");

const execAndWaitForEvent = async (eventType, func, maxTime = 500) => {
  let eventReceived = false;
  const eventCallback = () => {
    eventReceived = true;
  };

  subscribe(eventType, eventCallback);

  await func();

  const start = Date.now();

  while (Date.now() - start < maxTime) {
    if (eventReceived) {
      break;
    }

    await sleep(100);
  }

  unsubscribe(eventType, eventCallback);

  try {
    expect(eventReceived).toBe(true);
  } catch {
    throw new Error(`The event ${eventType} was not sent to Wilco`);
  }
};

module.exports = { execAndWaitForEvent };
