module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['eslint-plugin-tsdoc'],
  rules: {
    'tsdoc/syntax': 'warn'
  }
}
