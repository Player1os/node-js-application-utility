// Load npm modules.
import * as findConfig from 'find-config'

// Load node modules.
import * as path from 'path'

// Define a storage variable.
let projectPath = ''

// Export the function that determines the absolute path to the project.
export default () => {
	// Verify that the result cannot be retrieved from storage.
	if (projectPath === '') {
		// Attempt to find the project's package file path.
		const packageConfigPath = findConfig('package.json')
		if (packageConfigPath === null) {
			throw new Error("Cannot find the project's package configuration.")
		}
		projectPath = path.dirname(packageConfigPath)
	}
	return projectPath
}
