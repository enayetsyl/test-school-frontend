// commitlint.config.cjs
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [2, 'always', 100], // match backend: max 100 chars per body line
    'subject-case': [0], // allow any case in subject
  },
};
