const { CHARSETS } = require('./constants')
const getContentType = (header = '') => {
  const [type, charset = `charset=${CHARSETS.utf8}`] = header.split(';')

  return [type, charset.split('=')[1]]
}

module.exports = getContentType
