/** The result of `urlRedirectionMethods.deleteUrlRedirections`. */
export class UrlRedirectionDeleteResult {
    /** IDs of the redirections that were deleted. */
    deleted!: number[];
    /** IDs that did not match an active redirection (already deleted, or never existed). */
    notFound!: number[];
}
