module.exports = {
  extends: ['../../.eslintrc.js'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  overrides: [
    {
      files: '*.vue',
      extends: [
        '@vue/typescript/recommended',
        'plugin:vue/vue3-recommended',
        '@vue/typescript',
        '@vue/standard'
      ],
      env: {
        'vue/setup-compiler-macros': true
      },
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.vue']
      },
      plugins: ['vue'],
      rules: {
        'vue/multi-word-component-names': 0,
        "vue/singleline-html-element-content-newline": 0,
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
        'import/no-cycle': 1
      }
    }
  ]
}
