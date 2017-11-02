// Extract and parse the env variables.
const {
	extractEnv,
	extractRawEnv,
} = require('./index.js')
global._raw_env_ = extractRawEnv()
global._env_ = extractEnv(global._raw_env_)

// Setup module-alias to properly load non-relative local modules.
const moduleAlias = require('module-alias')
moduleAlias.addAlias('...', _env_.APP_ROOT_PATH)

// Load bluebird as the promise library.
global.Promise = require('bluebird')
