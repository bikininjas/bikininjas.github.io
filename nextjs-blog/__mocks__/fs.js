// Manual mock for fs module
module.exports = {
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn()
};
