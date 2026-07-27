export class Exception extends Error {

	constructor(message: string, inner?: Error) {
		const anyErr = inner as any
		const status = anyErr?.response?.status
		const data = anyErr?.response?.data
		const detail = data
			? (typeof data === "string"
				? data
				: (data.exceptionMessage ?? data.message ?? JSON.stringify(data)))
			: anyErr?.message

		// Surface the server's status + response body in the message. The Management API
		// (and other callers) only read Error.message, so folding the response detail in here
		// turns an opaque "Unable to save the container" into
		// "Unable to save the container (HTTP 500): <server message>".
		super(detail ? `${message}${status ? ` (HTTP ${status})` : ""}: ${detail}` : message)

		this.innerError = inner
		this.statusCode = status
		this.responseData = data
	}

	innerError?: Error
	/** HTTP status code from the underlying response, when available. */
	statusCode?: number
	/** Raw response body from the underlying response, when available. */
	responseData?: unknown
}
