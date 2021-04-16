const { HEADERS } = require('./constants')
const getContentType = require('./get-content-type')

const getProxyBody = ({ headers, response: { body } }) => {
  const [contentType] = getContentType(headers[HEADERS.names.content_type])

  switch (contentType) {
    case HEADERS.values.application_json:
      return JSON.stringify(body)
    default:
      return body
  }
}

const proxyRequest = (proxyConfig, req, client_res) => {
  const { request, response: mappedResponse } = proxyConfig
  const { protocol } = request

  // Add colon to protocol name if not present, as request expects that.
  if (!protocol.includes(':')) {
    request.protocol = `${protocol}:`
  }

  const proxy = require(protocol.replace(':', '')).request(request, response => {
    const { headers } = response
    const proxyResponse =
      typeof mappedResponse === 'object'
        ? mappedResponse
        : typeof mappedResponse === 'function'
        ? mappedResponse(response)
        : {
            response,
            ...headers,
          }
    const statusCode = proxyResponse.statusCode || response.statusCode

    proxyResponse.headers = proxyResponse.heades || headers

    client_res.writeHead(statusCode, {
      ...proxyResponse.headers,
      [HEADERS.names.x_proxied_to]: `${proxy.protocol}//${proxy.host}${proxy.path}`,
    })

    if (proxyResponse.response.body) {
      client_res.end(getProxyBody(proxyResponse))
    } else {
      proxyResponse.response.pipe(client_res)
    }
  })

  // Write the original request body to the proxy since it is already consumed
  proxy.write(req.body || '')

  // pipe original request to the proxy
  req.pipe(proxy)

  req.body = undefined
}

module.exports = proxyRequest
