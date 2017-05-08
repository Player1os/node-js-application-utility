// Load npm modules.
const dotenv = require('dotenv')
const findConfig = require('find-config')

// Populate unassigned process env keys with values defined in the .env file.
dotenv.config()

// Load environment variables into a config object.
const config = Object.assign({}, process.env)

// Load required config parameters from env schema file.
const configSchema = findConfig.read('.env.schema', 'utf-8')

// Check whether an env schema was found.
if (configSchema) {
	// Parse the config schema.
	const parsedConfigSchema = dotenv.parse(configSchema)

	// For each of the parsed configuration entries.
	Object.keys(parsedConfigSchema).forEach((key) => {
		// Check if all keys are part of the config object.
		if (!(key in config)) {
			throw new Error(`Required configuration entry '${key}' not found`)
		}

		// Parse entry values based on data type.
		switch (defaultConfig[key]) {
			case 'Boolean':
				config[key] = config[key] === 'TRUE'
				break;
			case 'Integer':
				config[key] = Number.parseInt(config[key], 10)
				break;
			case 'Float':
				config[key] = Number.parseFloat(config[key])
				break;
			case 'String':
				break;
			case 'JSON':
				config[key] = JSON.parse(config[key])
				break;
			default:
				throw new Error(`Unknown configuration entry data type '${defaultConfig[key]}' at key '${key}'`)
		}
	});
}

// Load the project's package file.
config.package = findConfig.require('package.json', {
	cwd: '..',
})

// Add common configuration entries to the config object.
config.APP_IS_PRODUCTION = config.NODE_ENV === 'production'

// Export the config object.
module.exports = config
