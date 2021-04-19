const processRequest = require('./process-request')
const bodyParser = require('./body-parser/body-parser')

/**
 * @typedef {Object} Request
 * @property {string} [method] - The request method.
 * @property {string} [urlPath] - The url to match.
 * @property {string} [urlPathPattern] - A pattern to match.
 * @property {Object} [parameters] - Matches to properties in the request body.
 */

/**
 * @typedef {Object} Response
 * @property {number} [status] - Status code.
 * @property {Object} [headers] - Reponse headers.
 * @property {Object} [body] - Query parameters.
 * @property {string} [bodyFileName] - File to send back to the client.
 */

/**
 * @typedef {Function} ResponseCallback
 * @param {Object} response - Http(s) server response.
 * @returns {Object} Http(s) server response.
 */

/**
 * @typedef ProxyRequest
 * @property {string} [protocol]
 * @property {number} [port]
 * @property {string} [host]
 * @property {string} [path]
 * @property {string} [method]
 * @property {Object} [headers]
 */

/**
 * @typedef {Object} ProxyResponse
 */

/**
 * @typedef {Object} ProxyClientResponse
 * @property {Object} response - The response object from the server.
 * @property {Object} [headers] - The headers.

/**
 * @typedef {Function} ProxyResponseCallback
 * @param {Object} response - The server response object.
 * @returns {ProxyClientResponse}
 */

/**
 * @typedef ProxyConfig
 * @property {ProxyRequest} request - The request options for the proxy.
 * @property {ProxyResponse|ProxyResponseCallback} [response] - The response for the client.
 */

/**
 * @typedef {Function} ProxyCallback
 * @param {Object} req - http(s) client request.
 * @returns {ProxyConfig} - The configuration to be used for the proxy.
 */

/**
 * @typedef {Object} Mapping
 * @property {number} [priority] - A priority number for the mapping the lower the number the higher the priority.
 * @property {Request} request - The request mapping.
 * @property {Response|ResponseCallback} response - The response mapping.
 * @property {boolean|string|ProxyConfig|ProxyCallback} [proxy] - Proxy configuration
 */

/**
 * @typedef {Object} ServerOptions
 * @property {Mapping[]} [mappings=[]] - The mappings for the request / response mapping.
 * @property {string} [files='__files'] - The directory response templates are served from.
 * @property {string} [protocol='http'] - Protocol can be http or https.
 * @property {string} [cwd=process.cwd()] - The working directory.
 */

/**
 * @typedef {Function} Middleware
 * @argument {Object} request
 * @argument {Object} response
 * @returns Void
 */

/**
 * @typedef {Function} UseMiddleware
 * @param {Middleware} middleware
 */

/**
 * @typedef StubServer
 * @property {Function} listen - Bound property to server.listen.
 * @property {Function} on - Bound property to server.on.
 * @property {Middleware[]} _middleWare - Array of middleware functions, do not use directly.
 * @property {UseMiddleware} use - Add middleware to the server.
 */

const getServer = protocol => {
  switch (protocol) {
    case 'http':
      return require('http')
    case 'https':
      return require('https')
  }
}

/**
 * Creates a stub server.
 *
 * @param {ServerOptions} options
 * @returns {StubServer} An instance of a stub server.
 */
const stubJs = (options = {}) => {
  options = {
    mappings: [],
    files: '__files',
    cwd: process.cwd(),
    protocol: 'http',
    ...options,
  }

  const { cwd, protocol } = options
  const server = getServer(protocol).createServer()

  /** @type {StubServer} */
  const StubServer = {
    listen: server.listen.bind(server),
    on: server.on.bind(server),
    _middleWare: [bodyParser],
    use(middleWare) {
      this._middleWare.push(middleWare)
    },
  }

  server.on('request', (req, res) => processRequest(StubServer, options, cwd, req, res))

  return StubServer
}

module.exports = stubJs
