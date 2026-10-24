import type * as React from 'react';

import { cn } from '@/lib/utils';

const DataTableContainer = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return (
        <div
            data-slot='data-table-container'
            className={cn(
                'grid min-h-0 grid-rows-[auto_1fr_auto] overflow-clip rounded-xl border bg-background',
                className,
            )}
            {...props}
        />
    );
};

const DataTableHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return <div data-slot='data-table-header' className={cn('p-2', className)} {...props} />;
};

const DataTableContent = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return (
        <div data-slot='data-table-content' className={cn('min-h-48 overflow-hidden border-t', className)} {...props} />
    );
};

const DataTableFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return (
        <div
            data-slot='data-table-footer'
            className={cn('flex flex-col items-center gap-2 border-t p-2 sm:flex-row sm:justify-between', className)}
            {...props}
        />
    );
};

export { DataTableContainer, DataTableContent, DataTableFooter, DataTableHeader };
