const fs = require('fs');
const path = require('path');

describe('ServiceTable component', () => {
  const tablePath = path.join(__dirname, '..', 'web', 'src', 'components', 'dashboard', 'ServiceTable.tsx');

  test('ServiceTable file should exist', () => {
    expect(fs.existsSync(tablePath)).toBe(true);
  });

  test('ServiceTable should import hooks and render table', () => {
    const content = fs.readFileSync(tablePath, 'utf8');
    expect(content).toContain('function ServiceTable');
    expect(content).toContain('useGetServices');
    expect(content).toContain("from '@/components/ui/input'");
    expect(content).toContain('ConfirmationModal');
  });
});
