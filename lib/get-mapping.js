const matchParams = require('./match-params')
const { PATH_TYPES } = require('./constants')

const getUrlMatcherType = request => {
  if (request.urlPath !== undefined) {
    return PATH_TYPES.urlPath
  }

  if (request.urlPathPattern !== undefined) {
    return PATH_TYPES.urlPathPattern
  }

  throw new Error('Unknown url matcher.')
}

const getUrlMatcher = (matcher, type) => {
  switch (type) {
    case PATH_TYPES.urlPath:
      return new RegExp(`^${matcher}$`)
    case PATH_TYPES.urlPathPattern:
      return typeof matcher === 'string' ? new RegExp(matcher) : matcher
  }

  throw new Error('Unknown url matcher.')
}

const getMappingWithPrio = mappings =>
  mappings.length
    ? mappings.sort((a, b) => (a.priority || Infinity) - (b.priority || Infinity))[0]
    : null

const getMapping = (mappings = [], url, payload = {}) => {
  const matches = []

  for (const mapping of mappings) {
    const { request } = mapping
    const urlMatcherType = getUrlMatcherType(request)
    const urlMatcher = request[urlMatcherType]
    const reg = getUrlMatcher(urlMatcher, urlMatcherType)
    const match = url.match(reg)

    if (match && matchParams(request.params, payload)) {
      // Add match and payload to mapping
      matches.push({ ...mapping, match, payload })
    }
  }

  return getMappingWithPrio(matches)
}

module.exports = getMapping
