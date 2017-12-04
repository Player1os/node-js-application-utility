// Load local modules.
import findProjectPath from '.../src/find_project_path'
import parseEnvSchema from '.../src/parse_env_schema'
import { EDataType } from '.../src/type/data_type.e'
import { IEnv } from '.../src/type/env.i'
import { IRawEnv } from '.../src/type/raw_env.i'

// Load npm modules.
import * as fse from 'fs-extra'

// Load node modules.
import * as path from 'path'

// Extracts the env variables by parsing and validating the raw env variables.
export default (rawEnv: IRawEnv) => {
	// Load the project's package file path.
	const projectPath = findProjectPath()

	// Load and parse the required config parameters from env schema file.
	const schema = parseEnvSchema(fse.readFileSync(path.join(projectPath, 'src', '.env.ts'), 'utf-8'))

	// Define the parsing result.
	const parsedConfig: IEnv = {}

	// For each of the parsed configuration entries.
	Object.keys(schema).forEach((key) => {
		// Check if all keys are part of the config object.
		if (!(key in rawEnv)) {
			throw new Error(`Required configuration entry '${key}' not found`)
		}

		// Parse entry values based on data type.
		switch (schema[key]) {
			case EDataType.Boolean:
				if ((rawEnv[key] !== 'FALSE') && (rawEnv[key] !== 'TRUE')) {
					throw new Error(`Invalid boolean value at key '${key}'. Must be one of 'TRUE' or 'FALSE'`)
				}
				parsedConfig[key] = rawEnv[key] === 'TRUE'
				break
			case EDataType.Integer:
				parsedConfig[key] = Number.parseInt(rawEnv[key], 10)
				if (isNaN(parsedConfig[key])) {
					throw new Error(`Invalid NaN value at key '${key}'.`)
				}
				break
			case EDataType.Float:
				parsedConfig[key] = Number.parseFloat(rawEnv[key])
				if (isNaN(parsedConfig[key])) {
					throw new Error(`Invalid NaN value at key '${key}'.`)
				}
				break
			case EDataType.String:
				parsedConfig[key] = rawEnv[key].toString()
				break
			case EDataType.JSON:
				try {
					parsedConfig[key] = JSON.parse(rawEnv[key])
				} catch (err) {
					let message = `Unparsable value at key '${key}'.`
					if (err instanceof Error) {
						message += ` ${err.message}.`
					}
					throw new Error(message)
				}
				break
			default:
				throw new Error(`Unknown configuration entry data type at key '${key}'.`)
		}
	})

	// Return the parsed config object.
	return parsedConfig
}
