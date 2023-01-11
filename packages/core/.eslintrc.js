module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint','eslint-plugin-tsdoc', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'tsdoc/syntax': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    "@typescript-eslint/no-unused-vars": "off",
    'no-global-assign': 'off',
    'no-multi-str': 'off',
    'class-methods-use-this': 'off',
    'no-console': 'off'
  }
}
