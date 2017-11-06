// Load npm modules.
import * as findConfig from 'find-config'

// Load node modules.
import * as path from 'path'

// Define a storage variable.
const projectPathMap = new Map<string, string>()

// Export the function that determines the absolute path to the project.
export default (projectPathStartpoint: string) => {
	// Verify that the result cannot be retrieved from storage.
	if (!projectPathMap.has(projectPathStartpoint)) {
		// Attempt to find the project's package file path.
		const packageConfigPath = findConfig('package.json', { cwd: path.resolve(path.dirname(projectPathStartpoint), '..', '..') })
		if (packageConfigPath === null) {
			throw new Error("Cannot find the project's package configuration.")
		}
		projectPathMap.set(projectPathStartpoint, path.dirname(packageConfigPath))
	}
	return projectPathMap.get(projectPathStartpoint) as string
}
