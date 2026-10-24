import type * as React from 'react';

import { cn } from '@/lib/utils';

import { bodyRowClassName, headerRowClassName, tableClassName } from '@/components/data-table/styles';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { DataTableContainer, DataTableContent, DataTableFooter, DataTableHeader } from './data-table';

type DataTableCellSkeletonKind = 'select' | 'actions' | 'text';

type DataTableCellSkeletonProps = {
    kind?: DataTableCellSkeletonKind;
    row: number;
    column: number;
    align?: 'start' | 'end';
};

const cellWidths = ['w-24', 'w-32', 'w-20', 'w-28', 'w-16', 'w-36'];

const DataTableCellSkeleton = ({ kind = 'text', row, column, align }: DataTableCellSkeletonProps) => {
    return (
        <div className={cn('flex h-6 items-center', align === 'end' && 'justify-end')}>
            {kind === 'select' && <Skeleton className='size-4 rounded-[4px]' />}
            {kind === 'actions' && <Skeleton className='size-6 rounded-md' />}
            {kind === 'text' && <Skeleton className={cn('h-4', cellWidths[(row + column) % cellWidths.length])} />}
        </div>
    );
};

type DataTableToolbarSkeletonProps = {
    search?: boolean;
    filters?: number;
    className?: string;
    children?: React.ReactNode;
};

const DataTableToolbarSkeleton = ({
    search = true,
    filters = 0,
    className,
    children,
}: DataTableToolbarSkeletonProps) => {
    return (
        <div data-slot='table-toolbar' className={cn('flex flex-wrap items-center gap-2', className)}>
            {search && <Input placeholder='Cari...' disabled className='h-7 min-w-40 flex-1 sm:max-w-80' />}
            {Array.from({ length: filters }, (_, index) => (
                <Skeleton key={index} className='h-7 w-24 rounded-lg' />
            ))}
            {children}
        </div>
    );
};

type DataTableRowsSkeletonProps = {
    columns?: number;
    rows?: number;
    selectable?: boolean;
    actions?: boolean;
};

const DataTableRowsSkeleton = ({
    columns = 6,
    rows = 10,
    selectable = false,
    actions = true,
}: DataTableRowsSkeletonProps) => {
    const kinds = Array.from({ length: columns }, (_, index): DataTableCellSkeletonKind => {
        if (selectable && index === 0) return 'select';
        if (actions && index === columns - 1) return 'actions';

        return 'text';
    });

    return (
        <Table containerClassName='h-full overflow-hidden' className={tableClassName}>
            <TableHeader>
                <TableRow className={headerRowClassName}>
                    {kinds.map((kind, column) => (
                        <TableHead key={column} className={cn(kind !== 'text' && 'w-8')}>
                            {kind === 'text' && <Skeleton className='h-4 w-20' />}
                            {kind === 'select' && <Skeleton className='size-4 rounded-[4px]' />}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: rows }, (_, row) => (
                    <TableRow key={row} className={bodyRowClassName}>
                        {kinds.map((kind, column) => (
                            <TableCell key={column} className={cn(kind !== 'text' && 'w-8')}>
                                <DataTableCellSkeleton kind={kind} row={row} column={column} />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const DataTableFooterSkeleton = () => {
    return (
        <DataTableFooter>
            <Skeleton className='h-4 w-40' />

            <div className='flex items-center gap-1.5'>
                <Skeleton className='size-7 rounded-lg' />
                <Skeleton className='size-7 rounded-lg' />
                <Skeleton className='h-7 w-28 rounded-lg' />
                <Skeleton className='size-7 rounded-lg' />
                <Skeleton className='size-7 rounded-lg' />
            </div>
        </DataTableFooter>
    );
};

type DataTableSkeletonProps = DataTableRowsSkeletonProps & {
    bounded?: boolean;
    search?: boolean;
    filters?: number;
    toolbar?: React.ReactNode;
    footer?: boolean;
    className?: string;
    children?: React.ReactNode;
};

const DataTableSkeleton = ({
    bounded = false,
    search = true,
    filters = 0,
    toolbar,
    footer = true,
    className,
    children,
    rows,
    ...rowsProps
}: DataTableSkeletonProps) => {
    return (
        <DataTableContainer className={cn(bounded && 'overflow-y-auto', className)}>
            {toolbar !== null && (
                <DataTableHeader>
                    {toolbar ?? <DataTableToolbarSkeleton search={search} filters={filters} />}
                </DataTableHeader>
            )}

            {children ?? (
                <DataTableContent className={cn(bounded && 'min-h-20', toolbar === null && 'border-t-0')}>
                    <DataTableRowsSkeleton rows={rows ?? (bounded ? 20 : 10)} {...rowsProps} />
                </DataTableContent>
            )}

            {footer && <DataTableFooterSkeleton />}
        </DataTableContainer>
    );
};

export type { DataTableCellSkeletonKind, DataTableSkeletonProps };
export {
    DataTableCellSkeleton,
    DataTableFooterSkeleton,
    DataTableRowsSkeleton,
    DataTableSkeleton,
    DataTableToolbarSkeleton,
};
