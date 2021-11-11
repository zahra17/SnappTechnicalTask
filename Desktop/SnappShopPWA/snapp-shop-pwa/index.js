const next = require('next')
const http = require('http')
require('./src/scripts/env.config')

const {
  logServerAddress,
  mobileRedirect,
} = require('./src/scripts/server.config')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT

const app = next({dev})
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const server = http
    .createServer((req, res) => {
      if (!dev) mobileRedirect(req, res)
      handler(req, res)
    })
    .listen(port, () => {
      if (dev) logServerAddress(server)
    })
})
