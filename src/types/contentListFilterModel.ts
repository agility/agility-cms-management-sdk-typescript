export interface ContentListFilterModel {
    sortIDs: number[];
    modifiedByIds: number[];
    dateRange: DateRangeFilter | null;
    stateIds: number[];
    fieldFilters: FieldFilter[];
    genericSearch: string;
}

export interface DateRangeFilter {
    startDate: string | null;
    endDate: string | null;
}

export interface NumRangeFilter {
    fromNum: number;
    toNum: number;
}

export interface FieldFilterValue {
    stringValue: string | null;
    dateRangeValue: DateRangeFilter | null;
    numRangeValue: NumRangeFilter | null;
    boolValue: boolean | null;
}

export interface FieldFilter {
    field: string | null;
    value: FieldFilterValue | null;
} 