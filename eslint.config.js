export default [
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      rules: {
        // Add any specific rules here
        'no-unused-vars': 'warn',
        'no-console': 'warn',
        'semi': ['warn', 'always'],
        'quotes': ['warn', 'single'],
      }
    }
  ];