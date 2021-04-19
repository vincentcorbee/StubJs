# Stubjs

A nodejs stub server for stubbing data and proxying requests.

Run as a standalone server or run an existing application over this server.

## Usage

Run a stub server

```javascript
const protocol = 'http'
const host = '127.0.0.1'
const port = 9000

const mappings = [
  {
    request: {
      urlPath: '/some-endpoint',
      method: 'GET',
      params: {
        cat: 'cars'
      }
    },
    reponse: {
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
```

TODO:

- Code documentation
- Examples
