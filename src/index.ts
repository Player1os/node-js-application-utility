// Load local modules.
import extractEnv from '.../src/extract_env'
import extractRawEnv from '.../src/extract_raw_env'
import { IEnv } from '.../src/type/env.i'
import { IRawEnv } from '.../src/type/raw_env.i'

// Export the private types.
export {
	IEnv,
	IRawEnv,
}

// Export the function that triggers the env extraction.
export default (projectPathStartpoint: string) => {
	// Extract and parse the env variables.
	const rawEnv = extractRawEnv(projectPathStartpoint)
	const env = extractEnv(projectPathStartpoint, rawEnv)

	// Set the result.
	return { env, rawEnv }
}
