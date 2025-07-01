const fs = require('fs');
const path = require('path');

describe('NestJS Fastify Configuration', () => {
  const rootPath = path.join(__dirname, '..');
  const apiPath = path.join(rootPath, 'api');
  const mainTsPath = path.join(apiPath, 'src', 'main.ts');
  const packageJsonPath = path.join(rootPath, 'package.json');
  const appModulePath = path.join(apiPath, 'src', 'app', 'app.module.ts');

  describe('Dependencies', () => {
    test('package.json should include Fastify dependencies', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      expect(
        packageJson.dependencies['@nestjs/platform-fastify']
      ).toBeDefined();
      expect(packageJson.dependencies['@nestjs/typeorm']).toBeDefined();
      expect(packageJson.dependencies['typeorm']).toBeDefined();
      expect(packageJson.dependencies['pg']).toBeDefined();
      expect(packageJson.dependencies['@nestjs/config']).toBeDefined();
    });

    test('package.json should include TypeScript types for pg', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      expect(packageJson.devDependencies['@types/pg']).toBeDefined();
    });

    test('package.json should not include platform-express (replaced by Fastify)', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      expect(
        packageJson.dependencies['@nestjs/platform-express']
      ).toBeUndefined();
    });
  });

  describe('Main.ts Configuration', () => {
    test('main.ts should exist', () => {
      expect(fs.existsSync(mainTsPath)).toBe(true);
    });

    test('main.ts should import FastifyAdapter', () => {
      const mainContent = fs.readFileSync(mainTsPath, 'utf8');

      expect(mainContent).toContain('FastifyAdapter');
      expect(mainContent).toContain('NestFastifyApplication');
      expect(mainContent).toContain('@nestjs/platform-fastify');
    });

    test('main.ts should use FastifyAdapter in create()', () => {
      const mainContent = fs.readFileSync(mainTsPath, 'utf8');

      expect(mainContent).toContain(
        'NestFactory.create<NestFastifyApplication>'
      );
      expect(mainContent).toContain('new FastifyAdapter({');
    });

    test('main.ts should configure Fastify options', () => {
      const mainContent = fs.readFileSync(mainTsPath, 'utf8');

      expect(mainContent).toContain('logger: true');
    });

    test('main.ts should enable CORS', () => {
      const mainContent = fs.readFileSync(mainTsPath, 'utf8');

      expect(mainContent).toContain('app.enableCors()');
    });

    test('main.ts should listen on correct port', () => {
      const mainContent = fs.readFileSync(mainTsPath, 'utf8');

      expect(mainContent).toContain('await app.listen(3001');
      expect(mainContent).toContain("'0.0.0.0'");
    });
  });

  describe('TypeORM Configuration', () => {
    test('app.module.ts should import TypeOrmModule', () => {
      expect(fs.existsSync(appModulePath)).toBe(true);

      const appModuleContent = fs.readFileSync(appModulePath, 'utf8');
      expect(appModuleContent).toContain(
        "import { TypeOrmModule } from '@nestjs/typeorm'"
      );
    });

    test('app.module.ts should import ConfigModule', () => {
      const appModuleContent = fs.readFileSync(appModulePath, 'utf8');

      expect(appModuleContent).toContain(
        "import { ConfigModule } from '@nestjs/config'"
      );
    });

    test('app.module.ts should configure TypeORM with PostgreSQL', () => {
      const appModuleContent = fs.readFileSync(appModulePath, 'utf8');

      expect(appModuleContent).toContain('TypeOrmModule.forRoot({');
      expect(appModuleContent).toContain("type: 'postgres'");
      expect(appModuleContent).toContain('process.env.DATABASE_URL');
    });

    test('app.module.ts should enable autoLoadEntities', () => {
      const appModuleContent = fs.readFileSync(appModulePath, 'utf8');

      expect(appModuleContent).toContain('autoLoadEntities: true');
    });

    test('app.module.ts should configure synchronize for development', () => {
      const appModuleContent = fs.readFileSync(appModulePath, 'utf8');

      expect(appModuleContent).toContain(
        "synchronize: process.env.NODE_ENV !== 'production'"
      );
    });
  });

  describe('Environment Configuration', () => {
    const envExamplePath = path.join(apiPath, '.env.example');

    test('.env.example should exist in api directory', () => {
      expect(fs.existsSync(envExamplePath)).toBe(true);
    });

    test('.env.example should define required database variables', () => {
      const envContent = fs.readFileSync(envExamplePath, 'utf8');

      expect(envContent).toContain('DATABASE_URL=');
      expect(envContent).toContain('NODE_ENV=development');
      expect(envContent).toContain('REDIS_URL=');
    });

    test('.env.example should include PostgreSQL connection string format', () => {
      const envContent = fs.readFileSync(envExamplePath, 'utf8');

      expect(envContent).toContain(
        'postgresql://postgres:password@postgres:5432/nx_monorepo_db'
      );
    });
  });

  describe('Database Module', () => {
    const databaseModulePath = path.join(
      apiPath,
      'src',
      'database',
      'database.module.ts'
    );

    test('database module should exist', () => {
      expect(fs.existsSync(databaseModulePath)).toBe(true);
    });

    test('database module should export TypeORM configuration', () => {
      const moduleContent = fs.readFileSync(databaseModulePath, 'utf8');

      expect(moduleContent).toContain('export class DatabaseModule');
      expect(moduleContent).toContain('@Module');
    });

    test('database module should handle connection URL parsing', () => {
      const moduleContent = fs.readFileSync(databaseModulePath, 'utf8');

      expect(moduleContent).toContain('DATABASE_URL');
      expect(moduleContent).toContain('url:');
    });
  });

  describe('Health Check', () => {
    const healthControllerPath = path.join(
      apiPath,
      'src',
      'health',
      'health.controller.ts'
    );

    test('health controller should exist', () => {
      expect(fs.existsSync(healthControllerPath)).toBe(true);
    });

    test('health controller should have database health check', () => {
      const controllerContent = fs.readFileSync(healthControllerPath, 'utf8');

      expect(controllerContent).toContain("@Controller('health')");
      expect(controllerContent).toContain('database');
      expect(controllerContent).toContain('@Get()');
    });
  });

  describe('Build Configuration', () => {
    const projectJsonPath = path.join(apiPath, 'project.json');

    test('project.json should maintain build targets', () => {
      expect(fs.existsSync(projectJsonPath)).toBe(true);

      const projectConfig = JSON.parse(
        fs.readFileSync(projectJsonPath, 'utf8')
      );
      expect(projectConfig.targets).toBeDefined();
      expect(projectConfig.targets.build).toBeDefined();
      expect(projectConfig.targets.serve).toBeDefined();
    });
  });
});
