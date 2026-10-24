import * as React from 'react';

import { useTableContext } from '@/integrations/tanstack-table/contexts';

import { cn } from '@/lib/utils';

import { Button, type ButtonProps } from '@/components/ui/button';

type TableRowSelectionContextValue = {
    count: number;
};

const TableRowSelectionContext = React.createContext<TableRowSelectionContextValue | null>(null);

const useTableRowSelectionContext = () => {
    const context = React.useContext(TableRowSelectionContext);

    if (!context) {
        throw new Error('useTableRowSelectionContext must be used within a <TableRowSelection />');
    }

    return context;
};

type TableRowSelectionProps = React.ComponentProps<'div'>;

const TableRowSelection = ({ className, children, ...props }: TableRowSelectionProps) => {
    const table = useTableContext();

    return (
        <table.Subscribe selector={(state) => state.rowSelection}>
            {(rowSelection) => {
                const count = Object.keys(rowSelection).length;

                return (
                    <TableRowSelectionContext.Provider value={{ count }}>
                        <div
                            data-slot='table-row-selection'
                            data-show={count > 0}
                            className={cn(
                                'fixed inset-x-0 z-40 mx-auto w-full max-w-xl px-4 bottom-20 sm:bottom-14',
                                'transition-all transition-discrete duration-200 ease-out',
                                'starting:translate-y-6 starting:opacity-0',
                                'data-[show=false]:hidden data-[show=false]:translate-y-6 data-[show=false]:opacity-0',
                                'motion-reduce:transition-none',
                                className,
                            )}
                            {...props}
                        >
                            {children}
                        </div>
                    </TableRowSelectionContext.Provider>
                );
            }}
        </table.Subscribe>
    );
};

type TableRowSelectionFrameProps = React.ComponentProps<'div'>;

const TableRowSelectionFrame = ({ className, ...props }: TableRowSelectionFrameProps) => {
    return (
        <div
            data-slot='table-row-selection-frame'
            className={cn('rounded-xl border bg-card p-2 text-card-foreground shadow', className)}
            {...props}
        />
    );
};

type TableRowSelectionContentProps = React.ComponentProps<'div'>;

const TableRowSelectionContent = ({ className, ...props }: TableRowSelectionContentProps) => {
    return (
        <div
            data-slot='table-row-selection-content'
            className={cn('flex items-center justify-between gap-3', className)}
            {...props}
        />
    );
};

type TableRowSelectionLabelProps = Omit<React.ComponentProps<'div'>, 'children'> & {
    children?: React.ReactNode | ((count: number) => React.ReactNode);
};

const TableRowSelectionLabel = ({ className, children, ...props }: TableRowSelectionLabelProps) => {
    const { count } = useTableRowSelectionContext();

    const content = typeof children === 'function' ? children(count) : children;

    return (
        <div data-slot='table-row-selection-label' className={cn('min-w-0', className)} {...props}>
            {content ?? (
                <span className='block truncate text-sm text-muted-foreground'>
                    {`${count.toLocaleString('id-ID')} data dipilih`}
                </span>
            )}
        </div>
    );
};

type TableRowSelectionActionsProps = React.ComponentProps<'div'>;

const TableRowSelectionActions = ({ className, ...props }: TableRowSelectionActionsProps) => {
    return (
        <div
            data-slot='table-row-selection-actions'
            className={cn('flex shrink-0 items-center gap-2', className)}
            {...props}
        />
    );
};

type TableRowSelectionClearProps = ButtonProps;

const TableRowSelectionClear = ({ onClick, ...props }: TableRowSelectionClearProps) => {
    const table = useTableContext();

    return (
        <Button
            data-slot='table-row-selection-clear'
            onClick={(event) => {
                onClick?.(event);

                if (event.defaultPrevented) return;

                table.resetRowSelection();
            }}
            {...props}
        />
    );
};

export type {
    TableRowSelectionActionsProps,
    TableRowSelectionClearProps,
    TableRowSelectionContentProps,
    TableRowSelectionFrameProps,
    TableRowSelectionLabelProps,
    TableRowSelectionProps,
};
export {
    TableRowSelection,
    TableRowSelectionActions,
    TableRowSelectionClear,
    TableRowSelectionContent,
    TableRowSelectionFrame,
    TableRowSelectionLabel,
};
