module.exports = {
  overrides: [
    {
      files: ["*.test.js"],
      excludedFiles: ["*.fixture.js", "**/snapshots/**"],
      rules: {
        "no-console": "warn",
      },
    },
  ],
};
