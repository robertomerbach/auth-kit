import nextPlugin from '@next/eslint-plugin-next';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/src/generated/**/*',
      '**/*.generated.*',
      '**/prisma/**/*',
      '**/wasm.*'
    ],
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      '@next/next': nextPlugin
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      ...typescriptPlugin.configs['recommended'].rules,
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true
      }],
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-this-alias': 'warn'
    }
  },
  {
    files: ['**/generated/**/*', '**/*.generated.*', '**/prisma/**/*', '**/wasm.*'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-this-alias': 'off'
    }
  }
]; 