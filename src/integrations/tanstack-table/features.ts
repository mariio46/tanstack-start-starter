import {
    columnFacetingFeature,
    columnFilteringFeature,
    constructFilterFn,
    createFacetedRowModel,
    createFacetedUniqueValues,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    filterFn_arrIncludesSome,
    filterFn_includesString,
    filterFn_inDateRange,
    globalFilteringFeature,
    metaHelper,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_text,
    tableFeatures,
} from '@tanstack/react-table';

type DataTableColumnMeta = {
    sticky?: 'start' | 'end';
    align?: 'start' | 'end';
    headerClassName?: string;
    cellClassName?: string;
};

const filterFn_inArray = constructFilterFn({
    filter: (dataValue, filterValue: unknown[]) => filterValue.includes(dataValue),
    autoRemove: (value) => !Array.isArray(value) || value.length === 0,
});

const features = tableFeatures({
    sortFns: {
        alphanumeric: sortFn_alphanumeric,
        text: sortFn_text,
    },
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),

    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),

    columnFilteringFeature,
    globalFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns: {
        includesString: filterFn_includesString,
        arrIncludesSome: filterFn_arrIncludesSome,
        inArray: filterFn_inArray,
        inDateRange: filterFn_inDateRange,
    },
    columnFacetingFeature,
    facetedRowModel: createFacetedRowModel(),
    facetedUniqueValues: createFacetedUniqueValues(),

    rowSelectionFeature,

    columnMeta: metaHelper<DataTableColumnMeta>(),
});

export type { DataTableColumnMeta };
export { features };
