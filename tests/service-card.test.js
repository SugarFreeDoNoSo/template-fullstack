const fs = require('fs');
const path = require('path');

describe('ServiceCard component', () => {
  const cardPath = path.join(__dirname, '..', 'web', 'src', 'components', 'dashboard', 'ServiceCard.tsx');

  test('ServiceCard file should exist', () => {
    expect(fs.existsSync(cardPath)).toBe(true);
  });

  test('ServiceCard should use Card and ConfirmationModal', () => {
    const content = fs.readFileSync(cardPath, 'utf8');
    expect(content).toContain('ConfirmationModal');
    expect(content).toContain('Card');
    expect(content).toContain('useDeleteService');
  });
});
