export class ContentListFilterModel {
	sortIDs!: number[];
	modifiedByIds!: number[];
	dateRange!: DateRangeFilter | null;
	stateIds!: number[];
	fieldFilters!: FieldFilter[];
	genericSearch!: string;
}

export class DateRangeFilter {
	startDate!: string | null;
	endDate!: string | null;
}

export class NumRangeFilter {
	fromNum!: number;
	toNum!: number;
}

export class FieldFilterValue {
	stringValue!: string | null;
	dateRangeValue!: DateRangeFilter | null;
	numRangeValue!: NumRangeFilter | null;
	boolValue!: boolean | null;
}

export class FieldFilter {
	field!: string | null;
	value!: FieldFilterValue | null;
}
