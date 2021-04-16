const fs = require('fs')
const path = require('path')
const getBodyFileName = require('./get-body-file-name')
const { HEADERS } = require('./constants')

const mapResponse = (mapping, filesDir, res, cwd) => {
  const { response, match } = mapping

  if (typeof response === 'function') {
    response(res, mapping)
  } else {
    const { headers = {}, status = 200, body, bodyFileName } = response
    res.writeHead(status, { ...headers })

    if (typeof bodyFileName === 'string') {
      res.writeHead(status, { ...headers, [HEADERS.names.x_mapped_to]: bodyFileName })

      const stream = fs.createReadStream(
        path.join(
          cwd,
          filesDir,
          match ? getBodyFileName(bodyFileName, match) : bodyFileName
        )
      )

      stream.on('error', err => {
        console.log(err)

        res.setHeader(HEADERS.names.content_type, HEADERS.values.text_plain)
        res.writeHead(404)
        res.end('')
      })

      stream.pipe(res)
    } else {
      res.writeHead(status, { ...headers })

      if (body === undefined) {
        res.end()
      } else {
        res.end(typeof body === 'object' ? JSON.stringify(body) : body)
      }
    }
  }
}

module.exports = mapResponse
