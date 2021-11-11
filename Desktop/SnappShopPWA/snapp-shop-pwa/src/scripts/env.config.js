const fs = require('fs-extra')
const path = require('path')
const dotenv = require('dotenv-extended')

const prod = path.resolve(process.cwd(), '.env')
const defaults = path.resolve(process.cwd(), '.env.defaults')

if (!fs.existsSync('.env')) fs.copySync(defaults, prod)

dotenv.load()

const setupENVs = () => {
  const env = {}
  Object.keys(process.env).forEach(key => {
    env[`process.env.${key}`] = JSON.stringify(process.env[key])
  })

  return env
}

module.exports = setupENVs
