import fs from 'fs';
import path from 'path';
import { cleanReports } from '../../scripts/clean-reports';

describe('cleanReports', () => {
  const testDir = path.join(__dirname, '../../cypress/reports/test');
  const testFiles = [
    'mochawesome/mochawesome.html',
    'mochawesome/mochawesome.json',
    'junit/results.xml',
    'mochawesome/mochawesome_.html',
    'mochawesome/mochawesome_.json',
  ];

  beforeEach(() => {
    // Create test directory structure
    fs.mkdirSync(path.join(testDir, 'mochawesome'), { recursive: true });
    fs.mkdirSync(path.join(testDir, 'junit'), { recursive: true });

    // Create test files
    testFiles.forEach(file => {
      fs.writeFileSync(path.join(testDir, file), 'test content');
    });
  });

  afterEach(() => {
    // Clean up test directory
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should keep one .html and .json file in mochawesome directory', () => {
    cleanReports(testDir);

    const mochawesomeDir = path.join(testDir, 'mochawesome');
    const files = fs.readdirSync(mochawesomeDir);

    expect(files).toHaveLength(2);
    expect(files).toEqual(expect.arrayContaining(['mochawesome.html', 'mochawesome.json']));
  });

  it('should keep one file in junit directory', () => {
    cleanReports(testDir);

    const junitDir = path.join(testDir, 'junit');
    const files = fs.readdirSync(junitDir);

    expect(files).toHaveLength(1);
    expect(files).toEqual(expect.arrayContaining(['results.xml']));
  });

  it('should handle non-existent directories gracefully', () => {
    const nonExistentDir = path.join(testDir, 'nonexistent');
    
    expect(() => cleanReports(nonExistentDir)).not.toThrow();
  });
});
