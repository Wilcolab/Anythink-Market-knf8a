const EventEmitter = require("events");
const { sleep } = require("../utils");
const { expect } = require("@playwright/test");
const { uid } = require("uid");

const eventEmitter = new EventEmitter();

const dispatch = (type) => {
  eventEmitter.emit(type);
};

const subscribe = (type, callback) => {
  eventEmitter.on(type, callback);
};

const unsubscribe = (type, callback) => {
  eventEmitter.removeListener(type, callback);
};

const wrapWithRequestId = (func) => {
  return () => {
    const requestId = uid();
    func(requestId);
    return requestId;
  };
};

const listenAndTriggerRequest = async (
  requestListenerCallback,
  requestTrigger
) => {
  const requestId = await requestListenerCallback();
  await execAndWaitForRequest(requestId, requestTrigger);
};

const execAndWaitForRequest = async (requestId, func, maxTime = 500) => {
  let eventPromise;
  const eventCallback = () => {
    eventPromise(`The event ${requestId} was sent to Wilco`);
  };

  const subscribePromiseAndExec = new Promise(async (resolve) => {
    subscribe(requestId, eventCallback);
    eventPromise = resolve;
    await func();
  });

  try {
    const result = await Promise.race([
      new Promise((resolve) => setTimeout(resolve, maxTime)),
      subscribePromiseAndExec,
    ]);
    expect(result).toBe(`The event ${requestId} was sent to Wilco`);
  } catch {
    throw new Error(`The event ${requestId} was not sent to Wilco`);
  } finally {
    unsubscribe(requestId, eventCallback);
  }
};

module.exports = {
  dispatch,
  subscribe,
  unsubscribe,
  wrapWithRequestId,
  listenAndTriggerRequest,
  execAndWaitForRequest,
};
