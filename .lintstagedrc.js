const lintstagedrc = {
  '*.{js,jsx,ts,tsx}': 'eslint --fix --cache',
  '*.{md,html,css,scss,json,jsonc}': 'prettier --write',
};

module.exports = lintstagedrc;
