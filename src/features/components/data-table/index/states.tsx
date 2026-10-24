import * as React from 'react';

import { useCreateAtom } from '@tanstack/react-store';
import type { PaginationState, SortingState } from '@tanstack/react-table';
import { useTanStackTableDevtools } from '@tanstack/react-table-devtools';

import { useAppTable } from '@/integrations/tanstack-table/context';

import { DataTableContainer, DataTableContent, DataTableFooter } from '@/components/custom/data-table';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

import { basicColumns } from './columns';
import { EMPTY_TICKETS, EXAMPLE_TICKETS } from './constants';

type ContentState = 'data' | 'pending' | 'fetching' | 'error' | 'empty';

const STATES: { value: ContentState; label: string }[] = [
    { value: 'data', label: 'Data' },
    { value: 'pending', label: 'Pending' },
    { value: 'fetching', label: 'Fetching' },
    { value: 'error', label: 'Error' },
    { value: 'empty', label: 'Kosong' },
];

const StatesDataTable = () => {
    'use no memo';

    const pagination = useCreateAtom<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const sorting = useCreateAtom<SortingState>([{ id: 'created', desc: true }]);

    const [contentState, setContentState] = React.useState<ContentState>('data');

    const table = useAppTable(
        {
            key: 'example-states-table',
            columns: basicColumns,
            data: contentState === 'empty' ? EMPTY_TICKETS : EXAMPLE_TICKETS,
            getRowId: (row) => row.id,
            atoms: { pagination, sorting },
            enableMultiSort: false,
            sortDescFirst: false,
        },
        (state) => state,
    );

    useTanStackTableDevtools(table);

    return (
        <div className='grid gap-4'>
            <ButtonGroup>
                {STATES.map((option) => (
                    <Button
                        key={option.value}
                        variant={contentState === option.value ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => setContentState(option.value)}
                    >
                        {option.label}
                    </Button>
                ))}
            </ButtonGroup>

            <table.AppTable>
                <DataTableContainer className='grid-rows-[1fr_auto]'>
                    <DataTableContent className='border-t-0'>
                        <table.Content
                            isPending={contentState === 'pending'}
                            isFetching={contentState === 'fetching'}
                            isError={contentState === 'error'}
                            onRetry={() => setContentState('data')}
                        />
                    </DataTableContent>

                    <DataTableFooter>
                        <table.RowCount />
                        <table.Pagination />
                    </DataTableFooter>
                </DataTableContainer>
            </table.AppTable>
        </div>
    );
};

export { StatesDataTable };
