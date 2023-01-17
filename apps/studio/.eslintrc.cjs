module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module",
    project: "./tsconfig.json"
  },
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "react",
    "import",
    "json-format"
  ],
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "airbnb-typescript",
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {}
}
