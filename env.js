// Extract and parse the env variables.
const {
	extractEnv,
	extractRawEnv,
} = require('./index.js')
const rawEnv = extractRawEnv()
const env = extractEnv(rawEnv)

// Store the extracted variables to the global namespace.
global._env_ = env
global._raw_env_ = rawEnv

// Load the extracted env variables into the process object.
process.env = Object.assign({}, rawEnv, process.env)
