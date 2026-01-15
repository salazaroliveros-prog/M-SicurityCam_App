module.exports = {
  testMatch: ["**/test.spec.js", "**/syntaxError.test.js"],
  testEnvironment: "jsdom",
  rootDir: __dirname,
  testPathIgnorePatterns: ["/node_modules/"],
};
