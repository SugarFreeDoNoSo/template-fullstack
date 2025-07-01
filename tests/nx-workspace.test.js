const fs = require('fs');
const path = require('path');

describe('NX Workspace Structure', () => {
  const rootPath = path.join(__dirname, '..');
  const nxJsonPath = path.join(rootPath, 'nx.json');
  const packageJsonPath = path.join(rootPath, 'package.json');

  describe('Workspace Configuration', () => {
    test('nx.json should exist', () => {
      expect(fs.existsSync(nxJsonPath)).toBe(true);
    });

    test('nx.json should have correct structure', () => {
      const nxConfig = JSON.parse(fs.readFileSync(nxJsonPath, 'utf8'));

      expect(nxConfig.installation).toBeDefined();
      expect(nxConfig.plugins).toBeDefined();
      expect(nxConfig.targetDefaults).toBeDefined();
    });

    test('package.json should include NX dependencies', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies['@nx/workspace']).toBeDefined();
      expect(packageJson.devDependencies['@nx/nest']).toBeDefined();
      expect(packageJson.devDependencies['@nx/next']).toBeDefined();
    });

    test('api project should exist in root', () => {
      const apiPath = path.join(rootPath, 'api');
      expect(fs.existsSync(apiPath)).toBe(true);
    });

    test('web project should exist in root', () => {
      const webPath = path.join(rootPath, 'web');
      expect(fs.existsSync(webPath)).toBe(true);
    });
  });

  describe('API Application (NestJS)', () => {
    const apiPath = path.join(rootPath, 'api');
    const apiSrcPath = path.join(apiPath, 'src');
    const apiMainPath = path.join(apiSrcPath, 'main.ts');
    const apiProjectJsonPath = path.join(apiPath, 'project.json');

    test('api app directory should exist', () => {
      expect(fs.existsSync(apiPath)).toBe(true);
    });

    test('api/src directory should exist', () => {
      expect(fs.existsSync(apiSrcPath)).toBe(true);
    });

    test('api/src/main.ts should exist', () => {
      expect(fs.existsSync(apiMainPath)).toBe(true);
    });

    test('api/project.json should exist and define NestJS targets', () => {
      expect(fs.existsSync(apiProjectJsonPath)).toBe(true);

      const projectConfig = JSON.parse(
        fs.readFileSync(apiProjectJsonPath, 'utf8')
      );
      expect(projectConfig.targets).toBeDefined();
      expect(projectConfig.targets.build).toBeDefined();
      expect(projectConfig.targets.serve).toBeDefined();
    });

    test('api should have NestJS structure', () => {
      const appModulePath = path.join(apiSrcPath, 'app', 'app.module.ts');
      const appControllerPath = path.join(
        apiSrcPath,
        'app',
        'app.controller.ts'
      );

      expect(fs.existsSync(appModulePath)).toBe(true);
      expect(fs.existsSync(appControllerPath)).toBe(true);
    });
  });

  describe('Web Application (NextJS)', () => {
    const webPath = path.join(rootPath, 'web');
    const webSrcPath = path.join(webPath, 'src');
    const webProjectJsonPath = path.join(webPath, 'project.json');
    const webNextConfigPath = path.join(webPath, 'next.config.js');

    test('web app directory should exist', () => {
      expect(fs.existsSync(webPath)).toBe(true);
    });

    test('web/project.json should exist and define NextJS targets', () => {
      expect(fs.existsSync(webProjectJsonPath)).toBe(true);

      const projectConfig = JSON.parse(
        fs.readFileSync(webProjectJsonPath, 'utf8')
      );
      expect(projectConfig.targets).toBeDefined();
      // NextJS targets are defined automatically by NX plugins
      expect(typeof projectConfig.targets).toBe('object');
    });

    test('web should have NextJS configuration', () => {
      expect(fs.existsSync(webNextConfigPath)).toBe(true);
    });

    test('web should have pages or app directory', () => {
      const pagesPath = path.join(webPath, 'pages');
      const appPath = path.join(webPath, 'app');
      const srcPagesPath = path.join(webSrcPath, 'pages');
      const srcAppPath = path.join(webSrcPath, 'app');

      const hasPages = fs.existsSync(pagesPath) || fs.existsSync(srcPagesPath);
      const hasApp = fs.existsSync(appPath) || fs.existsSync(srcAppPath);

      expect(hasPages || hasApp).toBe(true);
    });
  });

  describe('Shared Libraries', () => {
    const sharedTypesPath = path.join(rootPath, 'shared-types');
    const trpcConfigPath = path.join(rootPath, 'trpc-config');

    test('shared-types library should exist', () => {
      expect(fs.existsSync(sharedTypesPath)).toBe(true);
    });

    test('shared-types should have project.json', () => {
      const projectJsonPath = path.join(sharedTypesPath, 'project.json');
      expect(fs.existsSync(projectJsonPath)).toBe(true);
    });

    test('shared-types should have src directory with index.ts', () => {
      const srcPath = path.join(sharedTypesPath, 'src');
      const indexPath = path.join(srcPath, 'index.ts');

      expect(fs.existsSync(srcPath)).toBe(true);
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    test('trpc-config library should exist', () => {
      expect(fs.existsSync(trpcConfigPath)).toBe(true);
    });

    test('trpc-config should have project.json', () => {
      const projectJsonPath = path.join(trpcConfigPath, 'project.json');
      expect(fs.existsSync(projectJsonPath)).toBe(true);
    });

    test('trpc-config should have src directory with index.ts', () => {
      const srcPath = path.join(trpcConfigPath, 'src');
      const indexPath = path.join(srcPath, 'index.ts');

      expect(fs.existsSync(srcPath)).toBe(true);
      expect(fs.existsSync(indexPath)).toBe(true);
    });
  });

  describe('TypeScript Configuration', () => {
    test('root tsconfig.base.json should exist', () => {
      const tsconfigPath = path.join(rootPath, 'tsconfig.base.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
    });

    test('tsconfig.base.json should define path mappings for libs', () => {
      const tsconfigPath = path.join(rootPath, 'tsconfig.base.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

      expect(tsconfig.compilerOptions.paths).toBeDefined();
      expect(tsconfig.compilerOptions.paths['shared-types']).toBeDefined();
      expect(tsconfig.compilerOptions.paths['trpc-config']).toBeDefined();
    });
  });
});
