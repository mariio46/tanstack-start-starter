import { useCreateAtom } from '@tanstack/react-store';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { useTanStackTableDevtools } from '@tanstack/react-table-devtools';

import { useAppTable } from '@/integrations/tanstack-table/context';

import { DataTableContainer, DataTableContent, DataTableFooter } from '@/components/custom/data-table';

import { basicColumns } from './columns';
import { EXAMPLE_TICKETS } from './constants';

const BasicDataTable = () => {
    'use no memo';

    const pagination = useCreateAtom<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const sorting = useCreateAtom<SortingState>([{ id: 'created', desc: true }]);

    const table = useAppTable(
        {
            key: 'example-basic-table',
            columns: basicColumns,
            data: EXAMPLE_TICKETS,
            getRowId: (row) => row.id,
            atoms: { pagination, sorting },
            enableMultiSort: false,
            sortDescFirst: false,
        },
        (state) => state,
    );

    useTanStackTableDevtools(table);

    return (
        <table.AppTable>
            <DataTableContainer className='grid-rows-[1fr_auto]'>
                <DataTableContent className='border-t-0'>
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

export { BasicDataTable };
