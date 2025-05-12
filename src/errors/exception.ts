export class Exception extends Error {

	constructor(message: string, inner?: Error) {
		super(message)
		this.innerError = inner
	}

	innerError?: Error
}