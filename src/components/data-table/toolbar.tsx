import type * as React from 'react';

import { IconX } from '@tabler/icons-react';

import { useTableContext } from '@/integrations/tanstack-table/contexts';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

type DataTableToolbarProps = {
    className?: string;
    children: React.ReactNode;
};

const DataTableToolbar = ({ className, children }: DataTableToolbarProps) => {
    return (
        <div data-slot='table-toolbar' className={cn('flex flex-wrap items-center gap-2', className)}>
            {children}
        </div>
    );
};

type DataTableFilterResetProps = {
    onReset?: () => void;
};

const DataTableFilterReset = ({ onReset }: DataTableFilterResetProps) => {
    const table = useTableContext();

    return (
        <table.Subscribe selector={(state) => state.columnFilters}>
            {(columnFilters) => {
                if (columnFilters.length === 0) {
                    return null;
                }

                return (
                    <Button
                        className='rounded-lg'
                        variant='destructive'
                        size='sm'
                        onClick={() => {
                            table.resetColumnFilters();
                            onReset?.();
                        }}
                    >
                        <IconX data-icon='inline-start' />
                        Reset
                    </Button>
                );
            }}
        </table.Subscribe>
    );
};

export type { DataTableFilterResetProps, DataTableToolbarProps };
export { DataTableFilterReset, DataTableToolbar };
