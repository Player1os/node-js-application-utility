// Load local modules.
import findProjectPath from '.../src/find_project_path'
import { IRawEnv } from '.../src/type/raw_env.i'

// Load npm modules.
import * as dotenv from 'dotenv'
import * as fse from 'fs-extra'

// Load node modules.
import * as path from 'path'

// Extracts the raw env variables from multiple sources.
export default (projectPathStartpoint: string) => {
	// Load the project's package file path.
	const projectPath = findProjectPath(projectPathStartpoint)

	// Populate unassigned process env keys with values defined in the .env file.
	const rawEnv: IRawEnv = dotenv.parse(fse.readFileSync(path.join(projectPath, '.env'), 'utf-8'))

	// Add common configuration entries to the process env variables.
	rawEnv.APP_ROOT_PATH = projectPath

	// Ensure that the node env variable is set correctly.
	if (!('NODE_ENV' in rawEnv) || (['production', 'development'].indexOf(rawEnv.NODE_ENV) === -1)) {
		throw new Error('The NODE_ENV variable is not set.')
	}
	const isProducation = rawEnv.NODE_ENV !== 'developement'
	rawEnv.APP_IS_PRODUCTION = isProducation
		? 'TRUE'
		: 'FALSE'
	rawEnv.NODE_ENV = isProducation
		? 'production'
		: 'developement'

	// Ensure that the version variable is set correctly.
	const parsedPackageFile = fse.readJsonSync(path.join(projectPath, 'package.json'))
	if (typeof parsedPackageFile.version !== 'string') {
		throw new Error("The version key is not set in the project's package configuration.")
	}
	rawEnv.APP_VERSION = parsedPackageFile.version

	return rawEnv
}
