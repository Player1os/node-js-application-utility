// Load local modules.
import extractEnv from '.../src/extract_env'
import extractRawEnv from '.../src/extract_raw_env'

// Export the function that triggers the env extraction.
export default () => {
	// Extract and parse the env variables.
	const rawEnv = extractRawEnv()
	const env = extractEnv(rawEnv)

	// Store the extracted variables to the global namespace.
	Object.assign(global, {
		_env_: env,
		_raw_env_: rawEnv,
	})

	// Load the extracted env variables into the process object.
	process.env = Object.assign({}, rawEnv, process.env)
}
