const mockServer = require('./index')

const protocol = 'http'
const host = '127.0.0.1'
const port = 9000

const mappings = [
  {
    request: {
      url: '/some-endpoint?cat=cars',
      method: 'GET',
    },
    response: {
      status: 200,
      headers: {
        'content-type': 'application/json'
      },
      // Could also be writting in JSON notation
      body: {
        data: [{
          brand: 'Audi',
          model: 'A3'
        }, {
          brand: 'Ford',
          model: 'Mustang'
        }]
      }
    }
  }
]

const server = mockServer({ mappings }, { protocol, host, port })

server.listen(port, host, () =>
  console.log(`Server is running: ${protocol}://${host}:${port}`)
)


