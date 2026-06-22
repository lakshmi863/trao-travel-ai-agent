// backend/jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  verbose: true,
  // This helps close connections and clear cache after tests
  forceExit: true,
  detectOpenHandles: true 
};