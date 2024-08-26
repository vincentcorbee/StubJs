const matchParams = require('./match-params')
const { PATH_TYPES } = require('./constants')

const getUrlMatcherType = request => {
  if (request.urlPath !== undefined) {
    return PATH_TYPES.urlPath
  }

  if (request.url !== undefined) {
    return PATH_TYPES.url
  }

  if (request.urlPathPattern !== undefined) {
    return PATH_TYPES.urlPathPattern
  }

  throw new Error('Unknown url matcher.')
}

const escapeRegexp = (input) => input.replace(/[?\-+]/g, (match => `\\${match}`))

const getUrlMatcher = (matcher, type) => {
  switch (type) {
    case PATH_TYPES.urlPath:
    case PATH_TYPES.url:
        return new RegExp(`^${escapeRegexp(matcher)}$`)
    case PATH_TYPES.urlPathPattern:
      return typeof matcher === 'string' ? new RegExp(matcher) : matcher
  }

  throw new Error('Unknown url matcher.')
}

const getMappingWithPrio = mappings =>
  mappings.length
    ? mappings.sort((a, b) => (a.priority || Infinity) - (b.priority || Infinity))[0]
    : null

const getMapping = (mappings = [], request, options) => {
  const matches = []

  const { protocol } = options

  const { headers, url, body: payload } = request

  const { pathname } = new URL(`${protocol}://${headers.host}${url}`)

  for (const mapping of mappings) {
    const { request } = mapping

    const urlMatcherType = getUrlMatcherType(request)
    const urlMatcher = request[urlMatcherType]
    const reg = getUrlMatcher(urlMatcher, urlMatcherType)
    const match = reg.test(urlMatcherType === PATH_TYPES.url ? url : pathname)

    if (match && matchParams(request.params, payload)) {
      // Add match and payload to mapping
      matches.push({ ...mapping, match, payload })
    }
  }

  return getMappingWithPrio(matches)
}

module.exports = getMapping
