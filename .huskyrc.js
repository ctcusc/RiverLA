module.exports = {
  hooks: {
    'pre-commit': 'echo \"this should fail\" && exit 1',
  },
};
