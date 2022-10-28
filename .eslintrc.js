const { rules } = require('@typescript/eslint-plugin')

module.exports = {
  parser: 'vue-eslint-paser',
  paserOptions: {
    parser: '@typesctipt/parser',
    ecmaVersion: 2020,
    sourceFeatures: {
      jsx: true,
    },
  },
  extends: [
    'plugin:vue3-recommend',
    'plugin:@typescript/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],

  rules: {},
}
