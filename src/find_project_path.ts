// Load npm modules.
import * as findConfig from 'find-config'

// Load node modules.
import * as path from 'path'

// Define a storage variable.
let projectPath: null | string = null

// Export the function that determines the absolute path to the project.
export default () => {
	// Verify that the result cannot be retrieved from storage.
	if (projectPath === null) {
		// Attempt to find the project's package file path.
		const packageConfigPath = findConfig('package.json', { cwd: path.resolve(__dirname, '..') })
		if (packageConfigPath === null) {
			throw new Error("Cannot find the project's package configuration.")
		}
		projectPath = path.dirname(packageConfigPath)
	}
	return projectPath
}
