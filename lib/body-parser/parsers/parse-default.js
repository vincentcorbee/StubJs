const parseDefault = req => {
  let payload = []

  req.on('data', chunk => payload.push(chunk))

  req.on('end', () => (req.body = Buffer.concat(payload)))
}

module.exports = parseDefault
