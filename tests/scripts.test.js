const fs = require('fs');
const path = require('path');

describe('Scripts', () => {
  const scriptsDir = path.join(__dirname, '..', 'scripts');

  test('init-db.sh exists', () => {
    expect(fs.existsSync(path.join(scriptsDir, 'init-db.sh'))).toBe(true);
  });

  test('seed-dev.ts exists', () => {
    expect(fs.existsSync(path.join(scriptsDir, 'seed-dev.ts'))).toBe(true);
  });

  test('check-connections.sh exists', () => {
    expect(fs.existsSync(path.join(scriptsDir, 'check-connections.sh'))).toBe(true);
  });
});
