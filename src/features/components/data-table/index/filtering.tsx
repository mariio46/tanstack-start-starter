import { useCreateAtom, useSelector } from '@tanstack/react-store';
import type { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';
import { useTanStackTableDevtools } from '@tanstack/react-table-devtools';

import { useAppTable } from '@/integrations/tanstack-table/context';

import { DataTableContainer, DataTableContent, DataTableFooter, DataTableHeader } from '@/components/custom/data-table';
import { DataTableDateRangeFilter } from '@/components/data-table/date-range-filter';
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter';
import { DataTableSearch } from '@/components/data-table/search-input';
import { DataTableFilterReset, DataTableToolbar } from '@/components/data-table/toolbar';

import { filterColumns } from './columns';
import { EXAMPLE_TICKETS } from './constants';

const FilteringDataTable = () => {
    'use no memo';

    const pagination = useCreateAtom<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const sorting = useCreateAtom<SortingState>([{ id: 'created', desc: true }]);
    const globalFilter = useCreateAtom<string>('');
    const columnFilters = useCreateAtom<ColumnFiltersState>([]);

    const globalFilterValue = useSelector(globalFilter);

    const table = useAppTable(
        {
            key: 'example-filtering-table',
            columns: filterColumns,
            data: EXAMPLE_TICKETS,
            getRowId: (row) => row.id,
            atoms: { pagination, sorting, globalFilter, columnFilters },
            enableMultiSort: false,
            sortDescFirst: false,
        },
        (state) => state,
    );

    useTanStackTableDevtools(table);

    return (
        <table.AppTable>
            <DataTableContainer>
                <DataTableHeader>
                    <DataTableToolbar>
                        <DataTableSearch
                            className='min-w-40 flex-1'
                            value={globalFilterValue}
                            onValueChange={(value) => table.setGlobalFilter(value)}
                        />

                        <DataTableFacetedFilter column={table.getColumn('requester')} label='Pemohon' />
                        <DataTableFacetedFilter column={table.getColumn('status')} label='Status' />
                        <DataTableFacetedFilter column={table.getColumn('priority')} label='Prioritas' />
                        <DataTableDateRangeFilter column={table.getColumn('created')} label='Dibuat' />

                        <DataTableFilterReset />
                    </DataTableToolbar>
                </DataTableHeader>

                <DataTableContent>
                    <table.Content />
                </DataTableContent>

                <DataTableFooter>
                    <table.RowCount />
                    <table.Pagination />
                </DataTableFooter>
            </DataTableContainer>
        </table.AppTable>
    );
};

export { FilteringDataTable };
