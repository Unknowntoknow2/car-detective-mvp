module.exports = {
  overrides: [
    { files: ["src/**/*.tsx","src/**/*.ts"], env: { browser: true, es2022: true } },
    { files: ["src/**/types.ts","src/**/*.d.ts"], rules: { "no-undef": "off", "no-unused-vars":"off" } },
    { files: ["src/scripts/**/*.{js,ts}"], env: { node: true }, rules: { "no-undef":"off" } }
  ]
}
