const getContentType = require('../get-content-type')
const { parseJSON, parseText, parseDefault } = require('./parsers')
const { HEADERS } = require('../constants')

const bodyParser = req => {
  const [contentType] = getContentType(req.headers[HEADERS.names.content_type])

  switch (contentType) {
    case HEADERS.values.application_json:
      parseJSON(req)
      break
    case HEADERS.values.text_plain:
      parseText(req)
      break
    default:
      parseDefault(req)
  }
}

module.exports = bodyParser
