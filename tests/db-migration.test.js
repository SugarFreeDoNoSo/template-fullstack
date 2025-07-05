const fs = require('fs');
const path = require('path');

describe('Database Migration', () => {
  const migrationsDir = path.join(__dirname, '..', 'api', 'src', 'database', 'migrations');

  test('services migration exists', () => {
    const files = fs.readdirSync(migrationsDir);
    const hasMigration = files.some((f) => f.toLowerCase().includes('create-services'));
    expect(hasMigration).toBe(true);
  });
});
