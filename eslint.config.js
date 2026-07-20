const globals = require("globals");

module.exports = [
  {
    files: ["app.js", "auth.js", "firebase-config.js"],
    languageOptions: {
      sourceType: "script",
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // no-undef is the big one: catches a reference to a function/variable
      // that was never defined anywhere (this is exactly the class of bug
      // that broke every lesson except reading-comprehension for a full
      // day here — a call to currentExercise() with no matching
      // function currentExercise() {...} anywhere in the file).
      "no-undef": "error",
      "no-unused-vars": ["warn", { args: "none", caughtErrors: "none", varsIgnorePattern: "^_" }],
      "no-const-assign": "error",
      "no-dupe-keys": "error",
      "no-dupe-args": "error",
      "no-unreachable": "error",
      "no-fallthrough": "error",
      "no-redeclare": "error",
    },
  },
];
