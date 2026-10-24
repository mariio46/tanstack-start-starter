import { IconDots } from '@tabler/icons-react';

import { actionsColumn, selectionColumn } from '@/integrations/tanstack-table/column-presets';
import { createAppColumnHelper } from '@/integrations/tanstack-table/context';

import { fallback, formatDate } from '@/lib/utils';

import { DataTableRowCheckbox, DataTableSelectAllCheckbox } from '@/components/data-table/selection-checkbox';
import { DataTableSortButton } from '@/components/data-table/sort-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { type ExampleTicket, priorityVariants, statusVariants } from './constants';

const columnHelper = createAppColumnHelper<ExampleTicket>();

const selectDisplayColumn = columnHelper.display({
    id: 'select',
    ...selectionColumn,
    meta: { sticky: 'start' },
    header: () => <DataTableSelectAllCheckbox />,
    cell: ({ row }) => <DataTableRowCheckbox row={row} />,
});

const actionsDisplayColumn = columnHelper.display({
    ...actionsColumn,
    meta: { sticky: 'end', align: 'end', headerClassName: 'w-7', cellClassName: 'w-7' },
    cell: () => (
        <Button variant='outline' size='icon-sm' aria-label='Aksi'>
            <IconDots />
        </Button>
    ),
});

const ticketNumberColumn = columnHelper.accessor('ticket_number', {
    header: ({ column }) => <DataTableSortButton column={column}>Tiket</DataTableSortButton>,
    cell: (info) => <span className='font-medium whitespace-nowrap tabular-nums'>{fallback(info.getValue())}</span>,
});

const titleColumn = columnHelper.accessor('title', {
    header: ({ column }) => <DataTableSortButton column={column}>Judul</DataTableSortButton>,
    cell: (info) => <span className='whitespace-nowrap'>{fallback(info.getValue())}</span>,
});

const requesterColumn = columnHelper.accessor('requester', {
    filterFn: 'inArray',
    header: ({ column }) => <DataTableSortButton column={column}>Pemohon</DataTableSortButton>,
    cell: (info) => <span className='whitespace-nowrap'>{fallback(info.getValue())}</span>,
});

const divisionColumn = columnHelper.accessor('division', {
    filterFn: 'inArray',
    header: ({ column }) => <DataTableSortButton column={column}>Divisi</DataTableSortButton>,
    cell: (info) => <span className='whitespace-nowrap'>{fallback(info.getValue())}</span>,
});

const statusColumn = columnHelper.accessor('status', {
    filterFn: 'inArray',
    header: ({ column }) => <DataTableSortButton column={column}>Status</DataTableSortButton>,
    cell: (info) => fallback(info.getValue(), (value) => <Badge variant={statusVariants[value]}>{value}</Badge>),
});

const priorityColumn = columnHelper.accessor('priority', {
    filterFn: 'inArray',
    header: ({ column }) => <DataTableSortButton column={column}>Prioritas</DataTableSortButton>,
    cell: (info) => fallback(info.getValue(), (value) => <Badge variant={priorityVariants[value]}>{value}</Badge>),
});

const createdColumn = columnHelper.accessor('created', {
    filterFn: 'inDateRange',
    enableGlobalFilter: false,
    header: ({ column }) => <DataTableSortButton column={column}>Dibuat</DataTableSortButton>,
    cell: (info) => <span className='whitespace-nowrap'>{fallback(info.getValue(), formatDate)}</span>,
});

const basicColumns = columnHelper.columns([
    ticketNumberColumn,
    titleColumn,
    requesterColumn,
    statusColumn,
    createdColumn,
]);

const filterColumns = columnHelper.columns([
    ticketNumberColumn,
    titleColumn,
    requesterColumn,
    statusColumn,
    priorityColumn,
    createdColumn,
]);

const selectionColumns = columnHelper.columns([
    selectDisplayColumn,
    ticketNumberColumn,
    titleColumn,
    requesterColumn,
    statusColumn,
    createdColumn,
    actionsDisplayColumn,
]);

const virtualColumns = columnHelper.columns([
    selectDisplayColumn,
    ticketNumberColumn,
    titleColumn,
    requesterColumn,
    divisionColumn,
    statusColumn,
    priorityColumn,
    createdColumn,
    actionsDisplayColumn,
]);

export { basicColumns, filterColumns, selectionColumns, virtualColumns };
