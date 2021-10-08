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
    "import"
  ],
  root: true,
  settings: {
    "import/resolver": {
      node: {
        paths: [
          "src"
        ],
        extensions: [
          ".js",
          ".jsx",
          ".ts",
          ".tsx"
        ]
      }
    }
  },
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "plugin:react/recommended",
    "airbnb-typescript",
    'plugin:prettier/recommended',
  ],
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": ["error"],
    "react/display-name": "off",
    "react/no-unescaped-entities": "off"
  }
}