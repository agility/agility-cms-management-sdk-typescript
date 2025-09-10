export class Exception extends Error {
	innerError?: Error;

	constructor(message: string, inner?: Error) {
		super(message);
		this.innerError = inner;
	}
}
