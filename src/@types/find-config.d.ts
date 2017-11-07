declare module 'find-config' {
	function findConfig(filename: string, options: { cwd?: string }): null | string

	namespace findConfig {}

	export = findConfig
}
