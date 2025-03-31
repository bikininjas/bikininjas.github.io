// Mock pour le module remark
const remarkMock = {
  remark: jest.fn().mockReturnValue({
    use: jest.fn().mockReturnThis(),
    process: jest.fn().mockResolvedValue({ toString: jest.fn().mockReturnValue('<p>Contenu mockée</p>') })
  })
};

module.exports = remarkMock;
