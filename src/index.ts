// Load app modules.
import parseConfig from '.../src/parse_config'
import parseSchema from '.../src/parse_schema'
import { EDataType } from '.../src/types/e_data_type.d'

// Load npm modules.
import * as dotenv from 'dotenv'
import * as findConfig from 'find-config'
import * as fse from 'fs-extra'

// Load node modules.
import * as path from 'path'

// Npm module declarations.
declare function findConfig(fileName: string, options: { cwd: string }): string | null

// Load the project's package file path.
const packageFilePath = findConfig('package.json', { cwd: path.resolve(__dirname, '..') })
if (packageFilePath === null) {
	throw new Error('No "package.json" file could be found.')
}
const mainDirPath = path.dirname(packageFilePath)

// Populate unassigned process env keys with values defined in the .env file.
dotenv.config({ path: path.join(mainDirPath, '.env') })

// Add common configuration entries to the process env variables.
if (['production', 'development'].indexOf(process.env.NODE_ENV) === -1) {
	throw new Error('The nodenv variable is not set.')
}
const isProducation = process.env.NODE_ENV !== 'developement'
process.env.APP_IS_PRODUCTION = isProducation
	? 'TRUE'
	: 'FALSE'
process.env.NODE_ENV = isProducation
	? 'production'
	: 'developement'
process.env.APP_ROOT_PATH = path.dirname(packageFilePath)
const parsedPackageFile = fse.readJsonSync(packageFilePath)
if (typeof parsedPackageFile.version !== 'string') {
	throw new Error('The version key is not set in the "package.json" file.')
}
process.env.APP_VERSION = parsedPackageFile.version

// Load and parse the required config parameters from env schema file.
const schema = parseSchema(fse.readFileSync(path.join(mainDirPath, '.env.ts'), 'utf-8'), {
	APP_IS_PRODUCTION: EDataType.Boolean,
	APP_ROOT_PATH: EDataType.String,
	APP_VERSION: EDataType.String,
})

// Load and parse the config object.
const config = parseConfig(schema)

// Export the config object to the global scope.
if (typeof global === 'object') {
	global['_env_'] = config
}

// Export the config object.
export default config
