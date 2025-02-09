import js from '@eslint/js';

export default [
  {
    ignores: ['dist/**'], // Ignore the dist folder
  },
  js.configs.recommended,
  {
    files: ['src/**/*.ts'], // Include TypeScript files
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      quotes: ['error', 'single'],
    },
  },
  {
    files: ['src/public/**/*.js'], // Include JavaScript files in the public folder
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      quotes: ['error', 'single'],
    },
  },
];
