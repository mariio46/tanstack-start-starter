import type { CellData, Column, RowData } from '@tanstack/react-table';

import { useTableContext } from '@/integrations/tanstack-table/contexts';
import type { features } from '@/integrations/tanstack-table/features';

import { cn } from '@/lib/utils';

import { DateRangePicker } from '@/components/custom/date-range-picker';

type DateRangeFilterValue = [Date, Date];

type DataTableDateRangeFilterProps<TData extends RowData, TValue extends CellData> = {
    column: Column<typeof features, TData, TValue> | undefined;
    label: string;
    className?: string;
};

const DataTableDateRangeFilter = <TData extends RowData, TValue extends CellData>({
    column,
    label,
    className,
}: DataTableDateRangeFilterProps<TData, TValue>) => {
    const table = useTableContext();

    if (!column) {
        return null;
    }

    return (
        <table.Subscribe selector={(state) => state.columnFilters}>
            {(columnFilters) => {
                const range = columnFilters.find((filter) => filter.id === column.id)?.value as
                    | DateRangeFilterValue
                    | undefined;

                return (
                    <DateRangePicker
                        className={cn('rounded-lg', className)}
                        placeholder={label}
                        value={{ from: range?.[0], to: range?.[1] }}
                        onApply={({ from, to }) => column.setFilterValue([from, to])}
                    />
                );
            }}
        </table.Subscribe>
    );
};

export type { DataTableDateRangeFilterProps, DateRangeFilterValue };
export { DataTableDateRangeFilter };
