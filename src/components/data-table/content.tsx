import * as React from 'react';

import { useSelector } from '@tanstack/react-store';
import { useVirtualizer } from '@tanstack/react-virtual';

import { useTableContext } from '@/integrations/tanstack-table/contexts';
import type { DataTableColumnMeta } from '@/integrations/tanstack-table/features';

import { cn } from '@/lib/utils';

import { DataTableCellSkeleton, type DataTableCellSkeletonKind } from '@/components/custom/skeleton';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { bodyRowClassName, headerRowClassName, tableClassName } from './styles';

type DataTableVirtualOptions = {
    estimateSize?: number;
    overscan?: number;
    threshold?: number;
};

type DataTableContentProps = {
    isPending?: boolean;
    isFetching?: boolean;
    isError?: boolean;
    onRetry?: () => void;
    virtual?: boolean | DataTableVirtualOptions;
};

const defaultVirtualOptions = {
    estimateSize: 41,
    overscan: 8,
    threshold: 50,
} as const;

const maxSkeletonRows = 20;

function headClass(meta: DataTableColumnMeta | undefined) {
    return cn(
        meta?.sticky === 'start' &&
            'shadow-[inset_-1px_-1px_0_0_var(--border)] sticky left-0 z-10 bg-inherit [&:has([role=checkbox])]:w-8 [&:has([role=checkbox])]:pr-2.5',
        meta?.sticky === 'end' && 'shadow-[inset_1px_-1px_0_0_var(--border)] sticky right-0 z-10 bg-inherit',
        meta?.align === 'end' && 'text-right',
        meta?.headerClassName,
    );
}

function cellClass(meta: DataTableColumnMeta | undefined) {
    return cn(
        meta?.sticky === 'start' &&
            'shadow-[inset_-1px_-1px_0_0_var(--border)] [tr:last-child>&]:shadow-[inset_-1px_0_0_0_var(--border)] sticky left-0 z-10 bg-inherit [&:has([role=checkbox])]:w-8 [&:has([role=checkbox])]:pr-2.5',
        meta?.sticky === 'end' &&
            'shadow-[inset_1px_-1px_0_0_var(--border)] [tr:last-child>&]:shadow-[inset_1px_0_0_0_var(--border)] sticky right-0 z-10 bg-inherit',
        meta?.align === 'end' && 'text-right',
        meta?.cellClassName,
    );
}

function skeletonKind(columnId: string): DataTableCellSkeletonKind {
    return columnId === 'select' || columnId === 'actions' ? columnId : 'text';
}

const Content = ({
    isPending = false,
    isFetching = false,
    isError = false,
    onRetry,
    virtual = defaultVirtualOptions,
}: DataTableContentProps) => {
    'use no memo';

    const table = useTableContext();

    const leafColumns = table.getAllLeafColumns();
    const colSpan = leafColumns.length;
    const rows = table.getRowModel().rows;
    const { pageIndex, pageSize } = useSelector(table.atoms.pagination);

    const {
        estimateSize = defaultVirtualOptions.estimateSize,
        overscan = defaultVirtualOptions.overscan,
        threshold = defaultVirtualOptions.threshold,
    } = typeof virtual === 'object' ? virtual : {};

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const isVirtual = virtual !== false && !isPending && !isError && rows.length > threshold;

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: React.useCallback(() => estimateSize, [estimateSize]),
        getItemKey: React.useCallback((index: number) => rows[index].id, [rows]),
        overscan,
        enabled: isVirtual,
    });

    React.useEffect(() => {
        if (isVirtual) virtualizer.scrollToOffset(0);
    }, [pageIndex]);

    const renderRow = (row: (typeof rows)[number], index: number, virtualized: boolean) => (
        <table.Subscribe
            key={row.id}
            source={table.atoms.rowSelection}
            selector={(rowSelection) => rowSelection[row.id]}
        >
            {(isSelected) => (
                <TableRow
                    className={bodyRowClassName}
                    data-state={isSelected ? 'selected' : undefined}
                    data-index={virtualized ? index : undefined}
                    ref={virtualized ? virtualizer.measureElement : undefined}
                >
                    {row.getAllCells().map((cell) => (
                        <TableCell key={cell.id} className={cellClass(cell.column.columnDef.meta)}>
                            <table.FlexRender cell={cell} />
                        </TableCell>
                    ))}
                </TableRow>
            )}
        </table.Subscribe>
    );

    const renderBody = () => {
        if (isPending) {
            return Array.from({ length: Math.min(pageSize, maxSkeletonRows) }, (_, rowIndex) => (
                <TableRow key={rowIndex} className={bodyRowClassName}>
                    {leafColumns.map((column, columnIndex) => {
                        const kind = skeletonKind(column.id);

                        return (
                            <TableCell
                                key={column.id}
                                className={cn(cellClass(column.columnDef.meta), kind !== 'text' && 'w-8')}
                            >
                                <DataTableCellSkeleton
                                    kind={kind}
                                    row={rowIndex}
                                    column={columnIndex}
                                    align={column.columnDef.meta?.align}
                                />
                            </TableCell>
                        );
                    })}
                </TableRow>
            ));
        }

        if (isError) {
            return (
                <TableRow className={bodyRowClassName}>
                    <TableCell colSpan={colSpan}>
                        <Empty className='gap-4 py-6 md:py-6'>
                            <EmptyHeader>
                                <EmptyTitle>Gagal memuat data</EmptyTitle>
                                <EmptyDescription>Periksa koneksi kamu lalu coba lagi.</EmptyDescription>
                            </EmptyHeader>
                            {onRetry && (
                                <EmptyContent>
                                    <Button variant='outline' size='sm' onClick={onRetry}>
                                        Coba lagi
                                    </Button>
                                </EmptyContent>
                            )}
                        </Empty>
                    </TableCell>
                </TableRow>
            );
        }

        if (rows.length === 0) {
            return (
                <TableRow className={bodyRowClassName}>
                    <TableCell colSpan={colSpan}>
                        <Empty className='gap-4 py-6 md:py-6'>
                            <EmptyHeader>
                                <EmptyTitle>Tidak ada data</EmptyTitle>
                                <EmptyDescription>Tidak ada baris yang cocok dengan pencarian.</EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    </TableCell>
                </TableRow>
            );
        }

        if (isVirtual) {
            const virtualItems = virtualizer.getVirtualItems();

            if (virtualItems.length === 0) return null;

            const paddingTop = virtualItems[0].start;
            const paddingBottom = virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end;

            return (
                <>
                    {paddingTop > 0 && <tr aria-hidden style={{ height: paddingTop }} />}
                    {virtualItems.map((virtualItem) => renderRow(rows[virtualItem.index], virtualItem.index, true))}
                    {paddingBottom > 0 && <tr aria-hidden style={{ height: paddingBottom }} />}
                </>
            );
        }

        return rows.map((row, index) => renderRow(row, index, false));
    };

    return (
        <Table containerRef={scrollRef} containerClassName='h-full overflow-auto' className={tableClassName}>
            <TableHeader className='sticky top-0 z-20 [&_th:not(:first-child):not(:last-child)]:shadow-[inset_0_-1px_0_0_var(--border)]'>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className={headerRowClassName}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} className={headClass(header.column.columnDef.meta)}>
                                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody className={cn(isFetching && !isPending && 'opacity-60 pointer-events-none transition-opacity')}>
                {renderBody()}
            </TableBody>
        </Table>
    );
};

export type { DataTableContentProps, DataTableVirtualOptions };
export { Content };
