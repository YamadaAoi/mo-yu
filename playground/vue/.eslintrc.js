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
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-global-assign': 'off',
    'no-multi-str': 'off',
    'class-methods-use-this': 'off',
    'no-console': 'off'
  },
  overrides: [
    {
      files: '*.vue',
      extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        '@vue/typescript/recommended',
        '@vue/typescript',
        '@vue/standard',
        'plugin:prettier/recommended'
      ],
      env: {
        browser: true,
        es2021: true,
        node: true,
        'vue/setup-compiler-macros': true
      },
      parser: 'vue-eslint-parser',
      parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.vue']
      },
      plugins: ['vue', '@typescript-eslint', 'prettier'],
      rules: {
        'vue/multi-word-component-names': 0,
        'vue/singleline-html-element-content-newline': 0,
        'vue/multiline-html-element-content-newline': 0,
        'vue/multi-word-component-names': 0,
        'vue/max-attributes-per-line': [
          2,
          {
            singleline: 20,
            multiline: 1
          }
        ],
        'vue/require-default-prop': 0,
        'vue/no-multiple-template-root': 0,
        'vue/no-lone-template': 0,
        'vue/no-v-model-argument': 0,
        'vue/one-component-per-file': 0,
        'import/no-cycle': 1,
        'vue/html-self-closing': 0,
        'vue/no-v-html': 0,
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
}
