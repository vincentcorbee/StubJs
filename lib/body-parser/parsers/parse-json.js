const getContentType = require('../../get-content-type')
const { HEADERS } = require('../../constants')

const parseJSON = req => {
  const [contentType] = getContentType(req.headers[HEADERS.names.content_type])

  if (contentType === HEADERS.values.application_json) {
    let payload = ''

    req.on('data', chunk => {
      payload += chunk.toString()
    })

    req.on('end', () => {
      req.body = payload.startsWith('{') ? JSON.parse(payload) : payload
    })
  }
}

module.exports = parseJSON
