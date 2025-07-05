const fs = require('fs');
const path = require('path');

describe('Environment Files', () => {
  const root = path.join(__dirname, '..');

  test('.env.development exists', () => {
    expect(fs.existsSync(path.join(root, '.env.development'))).toBe(true);
  });

  test('.env.test exists', () => {
    expect(fs.existsSync(path.join(root, '.env.test'))).toBe(true);
  });
});
