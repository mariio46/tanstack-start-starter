import { useCreateAtom } from '@tanstack/react-store';
import type { PaginationState, RowSelectionState, SortingState } from '@tanstack/react-table';
import { useTanStackTableDevtools } from '@tanstack/react-table-devtools';

import { useAppTable } from '@/integrations/tanstack-table/context';

import { DataTableContainer, DataTableContent, DataTableFooter } from '@/components/custom/data-table';

import { virtualColumns } from './columns';
import { EXAMPLE_TICKETS_LARGE } from './constants';

const VirtualizationDataTable = () => {
    'use no memo';

    const pagination = useCreateAtom<PaginationState>({ pageIndex: 0, pageSize: 1000 });
    const sorting = useCreateAtom<SortingState>([{ id: 'ticket_number', desc: false }]);
    const rowSelection = useCreateAtom<RowSelectionState>({});

    const table = useAppTable(
        {
            key: 'example-virtualization-table',
            columns: virtualColumns,
            data: EXAMPLE_TICKETS_LARGE,
            getRowId: (row) => row.id,
            atoms: { pagination, sorting, rowSelection },
            enableMultiSort: false,
            sortDescFirst: false,
        },
        (state) => state,
    );

    useTanStackTableDevtools(table);

    return (
        <table.AppTable>
            <DataTableContainer className='h-128 grid-rows-[1fr_auto]'>
                <DataTableContent className='min-h-0 border-t-0'>
                    <table.Content virtual />
                </DataTableContent>

                <DataTableFooter>
                    <table.RowCount />
                    <table.Pagination />
                </DataTableFooter>
            </DataTableContainer>
        </table.AppTable>
    );
};

export { VirtualizationDataTable };
