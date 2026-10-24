import type { CellData, Column, RowData } from '@tanstack/react-table';

import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';

import { useTableContext } from '@/integrations/tanstack-table/contexts';
import type { features } from '@/integrations/tanstack-table/features';

import { Button } from '@/components/ui/button';

type DataTableSortButtonProps<TData extends RowData, TValue extends CellData> = {
    column: Column<typeof features, TData, TValue>;
    children: React.ReactNode;
};

const sortIcons = {
    asc: IconChevronUp,
    desc: IconChevronDown,
} as const;

const DataTableSortButton = <TData extends RowData, TValue extends CellData>({
    column,
    children,
}: DataTableSortButtonProps<TData, TValue>) => {
    const table = useTableContext();

    if (!column.getCanSort()) {
        return <span>{children}</span>;
    }

    return (
        <table.Subscribe selector={(state) => state.sorting}>
            {() => {
                const sorted = column.getIsSorted();
                const Icon = sorted ? sortIcons[sorted] : IconSelector;

                return (
                    <Button
                        variant='ghost'
                        size='sm'
                        className='-mx-2.5 h-7'
                        onClick={column.getToggleSortingHandler()}
                    >
                        <span>{children}</span>
                        <Icon />
                    </Button>
                );
            }}
        </table.Subscribe>
    );
};

export type { DataTableSortButtonProps };
export { DataTableSortButton };
