module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
    "jest/globals": true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  plugins: ["jest"],
  extends: ["eslint:recommended", "prettier", "plugin:import/recommended"],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: [""],
  rules: {
    eqeqeq: ["error", "always"],
    "import/no-unresolved": [2, { commonjs: true, amd: true }],
    "import/named": 2,
    "import/namespace": 2,
    "import/default": 2,
    "import/export": 2,
  },
};
