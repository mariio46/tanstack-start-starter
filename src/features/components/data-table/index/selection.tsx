import * as React from 'react';

import { useCreateAtom } from '@tanstack/react-store';
import type { PaginationState, RowSelectionState, SortingState } from '@tanstack/react-table';
import { useTanStackTableDevtools } from '@tanstack/react-table-devtools';

import { IconRestore, IconSquareRoundedX, IconTrash } from '@tabler/icons-react';

import { useAppTable } from '@/integrations/tanstack-table/context';

import { DataTableContainer, DataTableContent, DataTableFooter, DataTableHeader } from '@/components/custom/data-table';
import {
    TableRowSelection,
    TableRowSelectionActions,
    TableRowSelectionClear,
    TableRowSelectionContent,
    TableRowSelectionFrame,
    TableRowSelectionLabel,
} from '@/components/data-table/row-selection';
import { Button } from '@/components/ui/button';

import { selectionColumns } from './columns';
import { EXAMPLE_TICKETS } from './constants';

const SelectionDataTable = () => {
    'use no memo';

    const pagination = useCreateAtom<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const sorting = useCreateAtom<SortingState>([{ id: 'created', desc: true }]);
    const rowSelection = useCreateAtom<RowSelectionState>({});

    const [tickets, setTickets] = React.useState(EXAMPLE_TICKETS);

    const table = useAppTable(
        {
            key: 'example-selection-table',
            columns: selectionColumns,
            data: tickets,
            getRowId: (row) => row.id,
            atoms: { pagination, sorting, rowSelection },
            enableMultiSort: false,
            sortDescFirst: false,
        },
        (state) => state,
    );

    useTanStackTableDevtools(table);

    function removeSelected() {
        const selectedIds = new Set(Object.keys(rowSelection.get()));

        setTickets((previous) => previous.filter((ticket) => !selectedIds.has(ticket.id)));
        table.resetRowSelection();
    }

    return (
        <table.AppTable>
            <DataTableContainer>
                <DataTableHeader className='flex items-center justify-between gap-2'>
                    <span className='text-muted-foreground text-sm'>
                        Tahan Shift sambil klik checkbox untuk memilih satu rentang.
                    </span>
                    <Button
                        variant='outline'
                        size='sm'
                        disabled={tickets.length === EXAMPLE_TICKETS.length}
                        onClick={() => setTickets(EXAMPLE_TICKETS)}
                    >
                        <IconRestore data-icon='inline-start' />
                        Kembalikan baris
                    </Button>
                </DataTableHeader>

                <DataTableContent>
                    <table.Content />
                </DataTableContent>

                <DataTableFooter>
                    <table.RowCount />
                    <table.Pagination />
                </DataTableFooter>
            </DataTableContainer>

            <TableRowSelection>
                <TableRowSelectionFrame>
                    <TableRowSelectionContent>
                        <TableRowSelectionLabel />

                        <TableRowSelectionActions>
                            <Button variant='destructive' size='sm' onClick={removeSelected}>
                                <IconTrash />
                                <span className='hidden sm:inline'>Hapus</span>
                            </Button>
                            <TableRowSelectionClear variant='outline' size='sm'>
                                <IconSquareRoundedX />
                                <span className='hidden sm:inline'>Batal</span>
                            </TableRowSelectionClear>
                        </TableRowSelectionActions>
                    </TableRowSelectionContent>
                </TableRowSelectionFrame>
            </TableRowSelection>
        </table.AppTable>
    );
};

export { SelectionDataTable };
