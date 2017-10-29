// Load app modules.
import {
	EDataType,
	ISchema,
} from '.../src/types'

export default (fileData: string, defaultSchema: ISchema = {}) => {
	// Parse the lines of the file.
	const lines = fileData.split('\n')

	// Initialize the resulting schema, prepopulated with the default schema.
	const schema = Object.assign({}, defaultSchema)

	// Verify the header of the schema file.
	if (lines[0] !== 'declare const _env_: undefined | {') {
		throw new Error('The ".env.ts" schema file is invalid at line 0.')
	}

	// Iterate through the file's lines.
	for (let i = 1; ; ++i) {
		// Store the current line.
		const line = lines[i]

		try {
			// Check, if the end of the file was reached before the end of the object was found.
			if (line === undefined) {
				throw new Error()
			}

			// Check, if the current line is empty.
			if (line === '') {
				continue
			}

			// Check, if the end of the object was found.
			if (line === '}') {
				break
			}

			// Parse the current line.
			const [
				keyStr,
				typeStr,
			] = line.split(':')
			if (keyStr === undefined || typeStr === undefined) {
				throw new Error()
			}

			// Determine the data type based on the type string.
			let type: undefined | EDataType
			switch (typeStr.trim()) {
				case 'boolean,':
					type = EDataType.Boolean
					break
				case 'number, // integer':
					type = EDataType.Integer
					break
				case 'number,':
					type = EDataType.Float
					break
				case 'string,':
					type = EDataType.String
					break
				case 'string, // json':
					type = EDataType.JSON
					break
				default:
					throw new Error()
			}

			// Set a new entry in the schema object.
			schema[keyStr.trim()] = type
		} catch (err) {
			// Rethrow the error.
			throw new Error(`The ".env.ts" schema file is invalid at line ${i}.`)
		}
	}

	// Return the parsed schema.
	return schema
}
