const mapResponse = require('./map-response')
const getMapping = require('./get-mapping')
const proxyRequest = require('./proxy-request')
const { HEADERS } = require('./constants')

/**
 * @param {string} protocol
 * @returns {number} Port number
 */
const getPort = protocol => {
  switch (protocol) {
    case 'https':
      return 443
    default:
      return 80
  }
}

const processRequest = (instance, options, cwd, req, client_res) => {
  const { mappings = [], files = '__files' } = options
  const { url, method } = req

  for (const middleWare of instance._middleWare) {
    middleWare(req, client_res)
  }

  req.on('end', () => {
    const mapping = getMapping(mappings, url, req.body)

    if (mapping && mapping.proxy !== undefined) {
      const { headers, protocol, host } = req
      const proxyConfig =
        typeof mapping.proxy === 'object'
          ? mapping.proxy
          : typeof mapping.proxy === 'function'
          ? mapping.proxy(req)
          : {
              request: {
                port:
                  typeof mapping.proxy === 'number' ? mapping.proxy : getPort(protocol),
                path: url,
                host,
                method,
                headers,
                protocol,
              },
            }

      // Add protocol if not present
      proxyConfig.request.protocol = proxyConfig.request.protocol || 'http'

      // Add headers if not present
      proxyConfig.request.headers = proxyConfig.request.headers || headers

      // Add method if not present
      proxyConfig.request.method = proxyConfig.request.method || method

      proxyRequest(
        {
          ...proxyConfig,
        },
        req,
        client_res
      )
    } else if (mapping) {
      mapResponse(mapping, files, client_res, cwd)
    } else {
      console.log(`No mapping found for: ${url}`)

      client_res.setHeader(HEADERS.names.content_type, HEADERS.values.text_plain)
      client_res.writeHead(404)
      client_res.end('')
    }
  })
}

module.exports = processRequest
