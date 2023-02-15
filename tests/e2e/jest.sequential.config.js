module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/concurrent/"],
  globalSetup: "<rootDir>/setup.js",
  globalTeardown: "<rootDir>/teardown.js",
};
