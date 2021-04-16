const parseText = (req) => {
  let payload = '';

  req.on('data', (chunk) => (payload += chunk));

  req.on('end', () => (req.body = payload));
};

module.exports = parseText