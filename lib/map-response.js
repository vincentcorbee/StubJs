const fs = require('fs')
const path = require('path')
const getBodyFileName = require('./get-body-file-name')
const { HEADERS } = require('./constants')

const mapResponse = (mapping, filesDir, clientResponse, cwd) => {
  const { response, match } = mapping

  if (typeof response === 'function') {
    response(clientResponse, mapping)
  } else {
    const { headers = {}, status = 200, body, bodyFileName } = response

    if (typeof bodyFileName === 'string') {
      clientResponse.writeHead(status, { ...headers, [HEADERS.names.x_mapped_to]: bodyFileName })

      const stream = fs.createReadStream(
        path.join(
          cwd,
          filesDir,
          match ? getBodyFileName(bodyFileName, match) : bodyFileName
        )
      )

      stream.on('error', err => {
        console.log(err)

        clientResponse.setHeader(HEADERS.names.content_type, HEADERS.values.text_plain)
        clientResponse.writeHead(404)
        clientResponse.end()
      })

      stream.pipe(clientResponse)
    } else {
      clientResponse.writeHead(status, { ...headers })

      if (body === undefined) {
        clientResponse.end()
      } else {
        clientResponse.end(typeof body === 'object' ? JSON.stringify(body) : body)
      }
    }
  }
}

module.exports = mapResponse
