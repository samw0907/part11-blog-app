export default {
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    globals: {
      module: 'readonly',
      require: 'readonly',
      process: 'readonly',
    },
  },
  plugins: ['react', 'jest'],
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        'indent': ['error', 2],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'never'],
        'eqeqeq': 'error',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': ['error', 'always'],
        'arrow-spacing': ['error', { before: true, after: true }],
        'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
        'react/prop-types': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
