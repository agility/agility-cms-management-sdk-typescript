export interface PagedResult<T> {
    totalCount: number;
    items: T[];
}

export interface TokenPagedResult<T> {
    token: string | null;
    items: T[];
}
