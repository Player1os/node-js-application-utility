// Load npm modules.
import * as dotenv from 'dotenv'
import findConfig from 'find-config'

// Load node modules.
import * as fs from 'fs'
import * as path from 'path'

// Load the project's package file path.
const packageFilePath = findConfig('package.json', {
	cwd: path.resolve(__dirname, '..', '..'),
})
const parsedPackageFile = packageFilePath
	? JSON.parse(fs.readFileSync(packageFilePath, 'utf-8'))
	: null

// Populate unassigned process env keys with values defined in the .env file.
dotenv.config()

// Add common configuration entries to the process env variables.
process.env.APP_IS_PRODUCTION = process.env.NODE_ENV === 'production'
	? 'TRUE'
	: 'FALSE'
process.env.APP_ROOT_PATH = path.dirname(packageFilePath)
process.env.APP_VERSION = parsedPackageFile
	? parsedPackageFile.version
	: null

// Load environment variables into a config object.
const config: object = Object.assign({}, process.env)

// Load required config parameters from env schema file.
const configSchema = (findConfig.read('.env.schema', 'utf-8') || '')
	+ [
		'APP_IS_PRODUCTION=Boolean',
		'APP_ROOT_PATH=String',
		'APP_VERSION=String',
	].join('\n')

// Parse the config schema.
const parsedConfigSchema = dotenv.parse(configSchema)

// For each of the parsed configuration entries.
Object.keys(parsedConfigSchema).forEach((key) => {
	// Check if all keys are part of the config object.
	if (!(key in config)) {
		throw new Error(`Required configuration entry '${key}' not found`)
	}

	// Parse entry values based on data type.
	switch (parsedConfigSchema[key]) {
		case 'Boolean':
			if ((config[key] !== 'FALSE') && (config[key] !== 'TRUE')) {
				throw new Error('Boolean value must be TRUE or FALSE')
			}
			config[key] = config[key] === 'TRUE'
			break
		case 'Integer':
			config[key] = Number.parseInt(config[key], 10)
			break
		case 'Float':
			config[key] = Number.parseFloat(config[key])
			break
		case 'String':
			break
		case 'JSON':
			config[key] = JSON.parse(config[key])
			break
		default:
			throw new Error(`Unknown configuration entry data type '${configSchema[key]}' at key '${key}'`)
	}
})

// Export the config object.
export default config