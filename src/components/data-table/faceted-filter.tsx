import type { CellData, Column, RowData } from '@tanstack/react-table';

import { IconFilter } from '@tabler/icons-react';

import { useTableContext } from '@/integrations/tanstack-table/contexts';
import type { features } from '@/integrations/tanstack-table/features';

import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
} from '@/components/ui/combobox';

type FacetedFilterOption = {
    label: string;
    value: string;
    count: number;
};

type DataTableFacetedFilterProps<TData extends RowData, TValue extends CellData> = {
    column: Column<typeof features, TData, TValue> | undefined;
    label: string;
    formatLabel?: (value: string) => string;
    className?: string;
};

const toOptions = (facets: Map<any, number>, formatLabel?: (value: string) => string): FacetedFilterOption[] =>
    Array.from(facets.entries())
        .filter(([value]) => typeof value === 'string' && value.length > 0)
        .map(([value, count]) => ({ label: formatLabel ? formatLabel(value) : value, value, count }))
        .sort((a, b) => a.label.localeCompare(b.label));

type FacetedFilterProps = {
    label: string;
    options: FacetedFilterOption[];
    value: string[];
    onValueChange: (value: string[]) => void;
    className?: string;
};

const FacetedFilter = ({ label, options, value, onValueChange, className }: FacetedFilterProps) => (
    <Combobox multiple items={options} value={value} onValueChange={onValueChange} autoHighlight>
        <ComboboxTrigger render={<Button variant='outline' size='sm' className={cn('rounded-lg', className)} />}>
            <IconFilter data-icon='inline-start' />
            {label}
            {value.length > 0 && (
                <Badge variant='secondary' className='tabular-nums'>
                    {value.length}
                </Badge>
            )}
        </ComboboxTrigger>

        <ComboboxContent className='w-56'>
            <div className='border-b p-2'>
                <ComboboxInput showTrigger={false} placeholder={`Cari ${label.toLowerCase()}...`} />
            </div>

            <ComboboxEmpty>Tidak ada hasil.</ComboboxEmpty>

            <ComboboxList>
                {(option: FacetedFilterOption) => (
                    <ComboboxItem key={option.value} value={option.value}>
                        <span className='truncate'>{option.label}</span>
                        <Badge variant='muted' className='ml-auto h-4 tabular-nums'>
                            {option.count}
                        </Badge>
                    </ComboboxItem>
                )}
            </ComboboxList>

            {value.length > 0 && (
                <div className='border-t p-1'>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='w-full justify-center'
                        onClick={() => onValueChange([])}
                    >
                        Hapus filter
                    </Button>
                </div>
            )}
        </ComboboxContent>
    </Combobox>
);

const DataTableFacetedFilter = <TData extends RowData, TValue extends CellData>({
    column,
    label,
    formatLabel,
    className,
}: DataTableFacetedFilterProps<TData, TValue>) => {
    'use no memo';

    const table = useTableContext();

    if (!column) {
        return null;
    }

    return (
        <table.Subscribe selector={(state) => state.columnFilters}>
            {() => (
                <FacetedFilter
                    label={label}
                    options={toOptions(column.getFacetedUniqueValues(), formatLabel)}
                    value={(column.getFilterValue() as string[] | undefined) ?? []}
                    onValueChange={(value) => column.setFilterValue(value.length ? value : undefined)}
                    className={className}
                />
            )}
        </table.Subscribe>
    );
};

export type { DataTableFacetedFilterProps, FacetedFilterOption, FacetedFilterProps };
export { DataTableFacetedFilter, FacetedFilter };
