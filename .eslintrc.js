module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
    'jest/globals': true
  },
  'globals': {
    'module': 'readonly',
    'require': 'readonly',
    'process': 'readonly'
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'plugins': [
    'react', 'jest'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always'
    ],
    'arrow-spacing': [
      'error', { 'before': true, 'after': true }
    ],
    'no-console': [ 'warn', { allow: ['warn', 'error', 'info'] }],
    'react/prop-types': 0
  },
  'settings': {
    'react': {
      'version': 'detect'
    }
  }
}
