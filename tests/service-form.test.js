const fs = require('fs');
const path = require('path');

describe('ServiceForm component', () => {
  const formPath = path.join(__dirname, '..', 'web', 'src', 'components', 'dashboard', 'ServiceForm.tsx');

  test('ServiceForm file should exist', () => {
    expect(fs.existsSync(formPath)).toBe(true);
  });

  test('ServiceForm should import shadcn inputs', () => {
    const content = fs.readFileSync(formPath, 'utf8');
    expect(content).toContain("from '@/components/ui/input'");
    expect(content).toContain('function ServiceForm');
    expect(content).toContain('createServiceSchema');
  });
});
