const fs = require('fs');
const path = require('path');

describe('DevContainer Configuration', () => {
  const devcontainerPath = path.join(__dirname, '..', '.devcontainer');
  const devcontainerJsonPath = path.join(devcontainerPath, 'devcontainer.json');
  const dockerComposePath = path.join(devcontainerPath, 'docker-compose.yml');

  test('devcontainer.json should exist', () => {
    expect(fs.existsSync(devcontainerJsonPath)).toBe(true);
  });

  test('devcontainer.json should have correct structure', () => {
    const devcontainerContent = fs.readFileSync(devcontainerJsonPath, 'utf8');
    const config = JSON.parse(devcontainerContent);

    expect(config.name).toBeDefined();
    expect(config.dockerComposeFile).toContain('docker-compose.yml');
    expect(config.service).toBeDefined();
    expect(config.workspaceFolder).toBeDefined();
  });

  test('devcontainer.json should include required VS Code extensions', () => {
    const devcontainerContent = fs.readFileSync(devcontainerJsonPath, 'utf8');
    const config = JSON.parse(devcontainerContent);

    expect(config.customizations?.vscode?.extensions).toBeDefined();
    const extensions = config.customizations.vscode.extensions;

    // Required extensions for the project
    expect(extensions).toContain('ms-vscode.vscode-typescript-next');
    expect(extensions).toContain('ms-azuretools.vscode-docker');
    expect(extensions).toContain('ckolkman.vscode-postgres');
    expect(extensions).toContain('bradlc.vscode-tailwindcss');
  });

  test('docker-compose.yml should exist', () => {
    expect(fs.existsSync(dockerComposePath)).toBe(true);
  });

  test('docker-compose.yml should define postgres service on port 5432', () => {
    const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf8');

    expect(dockerComposeContent).toContain('postgres:');
    expect(dockerComposeContent).toContain('5432:5432');
    expect(dockerComposeContent).toContain('POSTGRES_');
  });

  test('docker-compose.yml should define redis service on port 6379', () => {
    const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf8');

    expect(dockerComposeContent).toContain('redis:');
    expect(dockerComposeContent).toContain('6379:6379');
  });

  test('docker-compose.yml should define app service for development', () => {
    const dockerComposeContent = fs.readFileSync(dockerComposePath, 'utf8');

    expect(dockerComposeContent).toContain('app:');
    expect(dockerComposeContent).toContain('depends_on:');
  });
});
