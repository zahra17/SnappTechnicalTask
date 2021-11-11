const webpack = require('webpack')
const withPWA = require('next-pwa')
const pJson = require('./package.json')
const withPlugins = require('next-compose-plugins')
const setupENVs = require('./src/scripts/env.config')
const bundleAnalyzer = require('@next/bundle-analyzer')
const routesConfig = require('./src/scripts/routes.config')
const runtimeCaching = require('./src/scripts/sw.cache.config')
// const withTM = require('next-transpile-modules')(['design-system'])

const isDev = process.env.NODE_ENV !== 'production'

routesConfig(isDev)

const plugins = [new webpack.DefinePlugin(setupENVs())]

const basConfig = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    config.plugins.push(...plugins)

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  },
})

const withAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

let transpileModules

if (isDev) {
  transpileModules = basConfig()
} else if (process.env.ANALYZE === 'true') {
  transpileModules = basConfig(withAnalyzer())
} else {
  transpileModules = basConfig(withPWA({pwa: {dest: 'public', runtimeCaching}}))
}

module.exports = withPlugins([transpileModules], {
  images: {
    domains: ['static.snapp-food.com'],
  },
  env: {
    APP_VERSION: pJson.version,
  },
})
