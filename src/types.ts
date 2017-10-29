export enum EDataType {
	Boolean,
	Integer,
	Float,
	String,
	JSON,
}

export interface ISchema {
	[key: string]: EDataType,
}

export interface IConfig {
	[key: string]: any,
}
