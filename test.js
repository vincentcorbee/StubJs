// const mockServer = require('./index')

// const protocol = 'http'
// const host = '127.0.0.1'
// const port = 9000

// const mappings = [
//   {
//     request: {
//       url: '/some-endpoint?cat=cars',
//       method: 'GET',
//     },
//     response: {
//       status: 200,
//       headers: {
//         'content-type': 'application/json'
//       },
//       // Could also be writting in JSON notation
//       body: {
//         data: [{
//           brand: 'Audi',
//           model: 'A3'
//         }, {
//           brand: 'Ford',
//           model: 'Mustang'
//         }]
//       }
//     }
//   }
// ]

// const server = mockServer({ mappings }, { protocol, host, port })

// server.listen(port, host, () =>
//   console.log(`Server is running: ${protocol}://${host}:${port}`)
// )

const p1 = new Promise((res, rej) => {
	setTimeout(() => {
  	console.log('hoi')
  	res(true)
  } ,2000)
})

const p2 = new Promise((res, rej) => {
  rej(false)
})

async function foo() {
	const result = await Promise.all([p2, p1])

  console.log(result)
}

