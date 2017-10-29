// Load app modules.
import {
	EDataType,
	IConfig,
	ISchema,
} from '.../src/types'

export default (schema: ISchema) => {
	// Load environment variables into a config object.
	const config: IConfig = Object.assign({}, process.env)

	// Define the parsing result.
	const parsedConfig: IConfig = {}

	// For each of the parsed configuration entries.
	Object.keys(schema).forEach((key) => {
		// Check if all keys are part of the config object.
		if (!(key in config)) {
			throw new Error(`Required configuration entry '${key}' not found`)
		}

		// Parse entry values based on data type.
		switch (schema[key]) {
			case EDataType.Boolean:
				if ((config[key] !== 'FALSE') && (config[key] !== 'TRUE')) {
					throw new Error('Boolean value must be TRUE or FALSE')
				}
				parsedConfig[key] = config[key] === 'TRUE'
				break
			case EDataType.Integer:
				parsedConfig[key] = Number.parseInt(config[key], 10)
				if (isNaN(parsedConfig[key])) {
					throw new Error(`Invalid value at key '${key}'.`)
				}
				break
			case EDataType.Float:
				parsedConfig[key] = Number.parseFloat(config[key])
				if (isNaN(parsedConfig[key])) {
					throw new Error(`Invalid value at key '${key}'.`)
				}
				break
			case EDataType.String:
				parsedConfig[key] = config[key].toString()
				break
			case EDataType.JSON:
				parsedConfig[key] = JSON.parse(config[key])
				break
			default:
				throw new Error(`Unknown configuration entry data type at key '${key}'.`)
		}
	})

	// Return the parsed config object.
	return parsedConfig
}
