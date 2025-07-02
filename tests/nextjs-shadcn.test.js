const fs = require('fs');
const path = require('path');

describe('NextJS 15 + shadcn/ui Configuration', () => {
  const rootPath = path.join(__dirname, '..');
  const webPath = path.join(rootPath, 'web');
  const packageJsonPath = path.join(rootPath, 'package.json');
  const componentsJsonPath = path.join(webPath, 'components.json');
  const tailwindConfigPath = path.join(webPath, 'tailwind.config.js');
  const globalsCssPath = path.join(webPath, 'src', 'app', 'globals.css');

  describe('Dependencies', () => {
    test('package.json should include Tailwind CSS dependencies', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      expect(packageJson.devDependencies['tailwindcss']).toBeDefined();
      expect(packageJson.devDependencies['postcss']).toBeDefined();
      expect(packageJson.devDependencies['autoprefixer']).toBeDefined();
    });

    test('package.json should include shadcn/ui related dependencies', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      expect(
        packageJson.dependencies['class-variance-authority']
      ).toBeDefined();
      expect(packageJson.dependencies['clsx']).toBeDefined();
      expect(packageJson.dependencies['tailwind-merge']).toBeDefined();
      expect(packageJson.dependencies['lucide-react']).toBeDefined();
    });

    test('package.json should include theming dependencies', () => {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      expect(packageJson.dependencies['next-themes']).toBeDefined();
    });
  });

  describe('shadcn/ui Configuration', () => {
    test('components.json should exist', () => {
      expect(fs.existsSync(componentsJsonPath)).toBe(true);
    });

    test('components.json should have correct structure', () => {
      const componentsConfig = JSON.parse(
        fs.readFileSync(componentsJsonPath, 'utf8')
      );

      expect(componentsConfig.style).toBeDefined();
      expect(componentsConfig.rsc).toBeDefined();
      expect(componentsConfig.tsx).toBeDefined();
      expect(componentsConfig.tailwind).toBeDefined();
      expect(componentsConfig.aliases).toBeDefined();
    });

    test('components.json should define correct paths', () => {
      const componentsConfig = JSON.parse(
        fs.readFileSync(componentsJsonPath, 'utf8')
      );

      expect(componentsConfig.aliases.components).toContain('src/components');
      expect(componentsConfig.aliases.utils).toContain('src/lib/utils');
    });
  });

  describe('Tailwind CSS Configuration', () => {
    test('tailwind.config.js should exist', () => {
      expect(fs.existsSync(tailwindConfigPath)).toBe(true);
    });

    test('tailwind.config.js should include shadcn preset', () => {
      const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');

      expect(tailwindConfig).toContain('darkMode:');
      expect(tailwindConfig).toContain('content:');
      expect(tailwindConfig).toContain('theme:');
      expect(tailwindConfig).toContain('plugins:');
    });

    test('tailwind.config.js should include CSS variables for theming', () => {
      const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');

      expect(tailwindConfig).toContain('colors:');
      expect(tailwindConfig).toContain('extend:');
    });
  });

  describe('Global Styles', () => {
    test('globals.css should exist', () => {
      expect(fs.existsSync(globalsCssPath)).toBe(true);
    });

    test('globals.css should include Tailwind directives', () => {
      const globalsCss = fs.readFileSync(globalsCssPath, 'utf8');

      expect(globalsCss).toContain('@tailwind base;');
      expect(globalsCss).toContain('@tailwind components;');
      expect(globalsCss).toContain('@tailwind utilities;');
    });

    test('globals.css should include CSS variables for theming', () => {
      const globalsCss = fs.readFileSync(globalsCssPath, 'utf8');

      expect(globalsCss).toContain(':root {');
      expect(globalsCss).toContain('--background:');
      expect(globalsCss).toContain('--foreground:');
      expect(globalsCss).toContain('--primary:');
    });

    test('globals.css should include dark mode variables', () => {
      const globalsCss = fs.readFileSync(globalsCssPath, 'utf8');

      expect(globalsCss).toContain('.dark {');
      expect(globalsCss).toContain('--background:');
      expect(globalsCss).toContain('--foreground:');
    });
  });

  describe('Utility Libraries', () => {
    const utilsPath = path.join(webPath, 'src', 'lib', 'utils.ts');

    test('utils.ts should exist', () => {
      expect(fs.existsSync(utilsPath)).toBe(true);
    });

    test('utils.ts should export cn function for class merging', () => {
      const utilsContent = fs.readFileSync(utilsPath, 'utf8');

      expect(utilsContent).toContain('clsx');
      expect(utilsContent).toContain('import { twMerge }');
      expect(utilsContent).toContain('export function cn(');
    });
  });

  describe('shadcn/ui Components', () => {
    const componentsPath = path.join(webPath, 'src', 'components', 'ui');

    test('ui components directory should exist', () => {
      expect(fs.existsSync(componentsPath)).toBe(true);
    });

    test('Button component should exist', () => {
      const buttonPath = path.join(componentsPath, 'button.tsx');
      expect(fs.existsSync(buttonPath)).toBe(true);
    });

    test('Button component should have proper structure', () => {
      const buttonPath = path.join(componentsPath, 'button.tsx');
      const buttonContent = fs.readFileSync(buttonPath, 'utf8');

      expect(buttonContent).toContain('import { Slot }');
      expect(buttonContent).toContain('cva');
      expect(buttonContent).toContain('export interface ButtonProps');
      expect(buttonContent).toContain('const Button =');
    });

    test('Card component should exist', () => {
      const cardPath = path.join(componentsPath, 'card.tsx');
      expect(fs.existsSync(cardPath)).toBe(true);
    });

    test('Input component should exist', () => {
      const inputPath = path.join(componentsPath, 'input.tsx');
      expect(fs.existsSync(inputPath)).toBe(true);
    });

    test('Label component should exist', () => {
      const labelPath = path.join(componentsPath, 'label.tsx');
      expect(fs.existsSync(labelPath)).toBe(true);
    });
  });

  describe('Theme Provider', () => {
    const themeProviderPath = path.join(
      webPath,
      'src',
      'components',
      'theme-provider.tsx'
    );

    test('theme-provider.tsx should exist', () => {
      expect(fs.existsSync(themeProviderPath)).toBe(true);
    });

    test('theme-provider should use next-themes', () => {
      const themeProviderContent = fs.readFileSync(themeProviderPath, 'utf8');

      expect(themeProviderContent).toContain('next-themes');
      expect(themeProviderContent).toContain('ThemeProvider');
      expect(themeProviderContent).toContain('export');
    });
  });

  describe('App Layout', () => {
    const layoutPath = path.join(webPath, 'src', 'app', 'layout.tsx');
    const rootPagePath = path.join(webPath, 'src', 'app', 'page.tsx');

    test('layout.tsx should include ThemeProvider', () => {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');

      expect(layoutContent).toContain('ThemeProvider');
      expect(layoutContent).toContain('theme-provider');
    });

    test('layout.tsx should include proper metadata', () => {
      const layoutContent = fs.readFileSync(layoutPath, 'utf8');

      expect(layoutContent).toContain('export const metadata');
      expect(layoutContent).toContain('title:');
      expect(layoutContent).toContain('description:');
    });

    test('root page should use shadcn components', () => {
      const pageContent = fs.readFileSync(rootPagePath, 'utf8');

      expect(pageContent).toContain("from '@/components/ui/");
    });
  });

  describe('PostCSS Configuration', () => {
    const postcssConfigPath = path.join(webPath, 'postcss.config.js');

    test('postcss.config.js should exist', () => {
      expect(fs.existsSync(postcssConfigPath)).toBe(true);
    });

    test('postcss.config.js should include tailwindcss and autoprefixer', () => {
      const postcssConfig = fs.readFileSync(postcssConfigPath, 'utf8');

      expect(postcssConfig).toContain('tailwindcss');
      expect(postcssConfig).toContain('autoprefixer');
    });
  });

  describe('TypeScript Configuration', () => {
    const tsconfigPath = path.join(webPath, 'tsconfig.json');

    test('tsconfig.json should include path aliases', () => {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

      expect(tsconfig.compilerOptions.paths).toBeDefined();
      expect(tsconfig.compilerOptions.paths['@/*']).toBeDefined();
    });
  });

  describe('Application Structure', () => {
    test('should have proper directory structure', () => {
      const srcPath = path.join(webPath, 'src');
      const componentsPath = path.join(srcPath, 'components');
      const libPath = path.join(srcPath, 'lib');
      const appPath = path.join(srcPath, 'app');

      expect(fs.existsSync(srcPath)).toBe(true);
      expect(fs.existsSync(componentsPath)).toBe(true);
      expect(fs.existsSync(libPath)).toBe(true);
      expect(fs.existsSync(appPath)).toBe(true);
    });

    test('should have pages directory with basic routes', () => {
      const appPath = path.join(webPath, 'src', 'app');
      const pagePath = path.join(appPath, 'page.tsx');
      const layoutPath = path.join(appPath, 'layout.tsx');

      expect(fs.existsSync(pagePath)).toBe(true);
      expect(fs.existsSync(layoutPath)).toBe(true);
    });
  });
});
