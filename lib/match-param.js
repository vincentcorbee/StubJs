const matchParam = (path, payload, val) =>
  path
    .split('.')
    .reduce((acc, key) => (typeof acc === 'object' ? acc[key] : acc), payload) === val

module.exports = matchParam
