module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/sequential/"],
  globalSetup: "<rootDir>/setup.js",
  globalTeardown: "<rootDir>/teardown.js",
  testTimeout: 30000,
};
