const fs = require('fs');
const path = require('path');

describe('Dashboard chart components', () => {
  const basePath = path.join(__dirname, '..', 'web', 'src', 'components', 'dashboard');
  const files = [
    'ServiceStatusPie.tsx',
    'ServiceStatusBar.tsx',
    'ServiceTrendLine.tsx',
    'KPIStats.tsx'
  ];

  test('chart component files should exist', () => {
    for (const file of files) {
      const fullPath = path.join(basePath, file);
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  test('chart components should import Recharts', () => {
    for (const file of files) {
      const content = fs.readFileSync(path.join(basePath, file), 'utf8');
      expect(content).toContain("from 'recharts'");
    }
  });
});
