module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest', 
  },
  testEnvironment: 'jsdom', 
  transformIgnorePatterns: ['/node_modules/'], 
};
