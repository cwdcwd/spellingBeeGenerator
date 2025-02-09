import js from '@eslint/js';


export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts'], // Include TypeScript files
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      quotes: ['error', 'single'],
    },
  },
];
