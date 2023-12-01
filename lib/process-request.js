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

/**
 *
 * @param {import('.').StubServer} instance
 * @param {import('.').ServerOptions} options
 * @param {string} cwd
 * @param {Object} request
 * @param {Object} clientResponse
 */
const processRequest = (instance, options, cwd, request, clientResponse) => {
  const { mappings = [], files = '__files' } = options
  const { url, method } = request

  for (const middleWare of instance._middleWare) middleWare(request, clientResponse)

  request.on('end', () => {
    const mapping = getMapping(mappings, request, options)

    if (mapping && mapping.proxy !== undefined) {
      const { headers, protocol, host } = request
      const proxyConfig =
        typeof mapping.proxy === 'object'
          ? mapping.proxy
          : typeof mapping.proxy === 'function'
          ? mapping.proxy(request)
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
        request,
        clientResponse
      )
    } else if (mapping) {
      mapResponse(mapping, files, clientResponse, cwd)
    } else {
      console.log(`No mapping found for: ${url}`)

      clientResponse.setHeader(HEADERS.names.content_type, HEADERS.values.text_plain)
      clientResponse.writeHead(404)
      clientResponse.end('')
    }
  })
}

module.exports = processRequest
