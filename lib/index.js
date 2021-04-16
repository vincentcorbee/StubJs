const processRequest = require('./process-request')
const bodyParser = require('./body-parser/body-parser')

/**
 * @typedef Request
 * @type {object}
 * @property {string} [method] - The request method.
 * @property {string} [urlPath] - The url to match.
 * @property {string} [urlPathPattern] - A pattern to match.
 * @property {object} [parameters] - Matches to properties in the request body.
 */

/**
 * @typedef Response
 * @type {object}
 * @property {number} [status] - Status code.
 * @property {object} [headers] - Reponse headers.
 * @property {object} [body] - Query parameters.
 * @property {string} [bodyFileName] - File to send back to the client.
 */

/**
 * @typedef ResponseCallback
 * @type {(response) => any}
 * @param {object} response - Http(s) server response.
 * @returns {object} Http(s) server response.
 */

/**
 * @typedef ProxyRequest
 * @property {string} [protocol]
 * @property {number} [port]
 * @property {string} [host]
 * @property {string} [path]
 * @property {string} [method]
 * @property {object} [headers]
 */

/**
 * @typedef ProxyResponse
 * @type {object}
 */

/**
 * @typedef ProxyClientResponse
 * @type {object}
 * @property {object} response - The response object from the server.
 * @property {object} [headers] - The headers.

/**
 * @typedef ProxyResponseCallback
 * @type {function}
 * @param {object} response - The server response object.
 * @returns {ProxyClientResponse}
 */

/**
 * @typedef ProxyConfig
 * @property {ProxyRequest} request - The request options for the proxy.
 * @property {ProxyResponse|ProxyResponseCallback} [response] - The response for the client.
 */

/**
 * @typedef ProxyCallback
 * @type {function}
 * @param {object} req - http(s) client request.
 * @returns {ProxyConfig} - The configuration to be used for the proxy.
 */

/**
 * @typedef Mapping
 * @type {object}
 * @property {number} [priority] - A priority number for the mapping the lower the number the higher the priority.
 * @property {Request} request - The request mapping.
 * @property {Response|ResponseCallback} response - The response mapping.
 * @property {boolean|string|ProxyConfig|ProxyCallback} [proxy] - Proxy configuration
 */

/**
 * @typedef ServerOptions
 * @type {object}
 * @property {Mapping[]} [mappings=[]] - The mappings for the request / response mapping.
 * @property {string} [files='__files'] - The directory response templates are served from.
 * @property {string} [protocol='http'] - Protocol can be http or https.
 * @property {string} [cwd=process.cwd()] - The working directory.
 */

/**
 * @typedef Middleware
 * @type {(response: any) => void}
 */

/**
 * @function UseMiddleware
 * @param {Middleware} middleware
 */

/**
 * @typedef StubServer
 * @property {(port: number, host: string, cb: () => void) => void} listen - Bound property to server.listen.
 * @property {(event: string, cb: () => void) => void} on - Bound property to server.on.
 * @property {Middleware[]} _middleWare - Array of middleware functions, do not use directly.
 * @property {(Middleware: Middleware) => void} use - Add middleware to the server.
 */

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
  const server = require(protocol).createServer()

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
