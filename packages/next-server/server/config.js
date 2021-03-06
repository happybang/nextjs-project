import findUp from 'find-up'
import {CONFIG_FILE} from 'inext-server/constants'

const targets = ['server', 'serverless']

const defaultConfig = {
  webpack: null,
  webpackDevMiddleware: null,
  poweredByHeader: true,
  distDir: '.next',
  assetPrefix: '',
  configOrigin: 'default',
  useFileSystemPublicRoutes: true,
  generateBuildId: () => null,
  generateEtags: true,
  pageExtensions: ['jsx', 'js'],
  target: 'server',
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
    websocketPort: 0,
    websocketProxyPath: '/',
    websocketProxyPort: null
  }
}

function normalizeConfig (phase, config) {
  if (typeof config === 'function') {
    return config(phase, {defaultConfig})
  }

  return config
}

export default function loadConfig (phase, dir, customConfig) {
  if (customConfig) {
    return {...defaultConfig, configOrigin: 'server', ...customConfig}
  }
  const path = findUp.sync(CONFIG_FILE, {
    cwd: dir
  })

  // If config file was found
  if (path && path.length) {
    const userConfigModule = require(path)
    const userConfig = normalizeConfig(phase, userConfigModule.default || userConfigModule)
    if (userConfig.target && !targets.includes(userConfig.target)) {
      throw new Error(`Specified target is invalid. Provided: "${userConfig.target}" should be one of ${targets.join(', ')}`)
    }
    if (userConfig.onDemandEntries) {
      userConfig.onDemandEntries = {
        ...defaultConfig.onDemandEntries,
        ...userConfig.onDemandEntries
      }
    }
    return {...defaultConfig, configOrigin: CONFIG_FILE, ...userConfig}
  }

  return defaultConfig
}
