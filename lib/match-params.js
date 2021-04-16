const matchParam = require('./match-param');

const matchParams = (params = {}, payload) => {
  for (const [path, val] of Object.entries(params)) {
    if (!matchParam(path, payload, val)) {
      return false;
    }
  }

  return true;
};

module.exports = matchParams;
