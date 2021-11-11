const os = require('os')
const chalk = require('chalk')
const boxen = require('boxen')
const useragent = require('express-useragent')

const getNetworkAddress = () => {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      const {address, family, internal} = interface
      if (family === 'IPv4' && !internal) {
        return address
      }
    }
  }
}

const logServerAddress = server => {
  const details = server.address()
  const {isTTY} = process.stdout
  let localAddress = null
  let networkAddress = null

  if (typeof details === 'string') {
    localAddress = details
  } else if (typeof details === 'object' && details.port) {
    const address = details.address === '::' ? 'localhost' : details.address
    const ip = getNetworkAddress()

    localAddress = `http://${address}:${details.port}`
    networkAddress = `http://${ip}:${details.port}`
  }

  if (isTTY) {
    let message = chalk.green('Serving!')

    if (localAddress) {
      const prefix = networkAddress ? '- ' : ''
      const space = networkAddress ? '            ' : '  '

      message += `\n\n${chalk.bold(`${prefix}Local:`)}${space}${localAddress}`
    }

    if (networkAddress) {
      message += `\n${chalk.bold('- On Your Network:')}  ${networkAddress}`
    }

    console.log(boxen(message, {padding: 1, borderColor: 'green', margin: 1}))
  }
}
function mobileRedirect(req, res) {
  var source = req.headers['user-agent']
  var ua = useragent.parse(source)
  if (ua.isMobile && req.url !== '/faq') {
    res.writeHead(302, {
      Location: 'https://shop.snappfood.ir',
    })
    res.end()
  }
}

module.exports = {logServerAddress, mobileRedirect}
