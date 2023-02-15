const dispatch = (type) => {
  global.eventEmitter.emit(type);
};

const subscribe = (type, callback) => {
  global.eventEmitter.on(type, callback);
};

const unsubscribe = (type, callback) => {
  global.eventEmitter.removeListener(type, callback);
};

module.exports = { dispatch, subscribe, unsubscribe };
