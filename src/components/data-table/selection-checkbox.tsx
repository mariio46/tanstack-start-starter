import type { Row, RowData } from '@tanstack/react-table';

import { useTableContext } from '@/integrations/tanstack-table/contexts';
import type { features } from '@/integrations/tanstack-table/features';

import { Checkbox } from '@/components/ui/checkbox';

type DataTableRowCheckboxProps<TData extends RowData> = {
    row: Row<typeof features, TData>;
};

function isShiftKey(event: Event) {
    return (event instanceof MouseEvent || event instanceof KeyboardEvent) && event.shiftKey;
}

const DataTableSelectAllCheckbox = () => {
    const table = useTableContext();

    return (
        <table.Subscribe source={table.atoms.rowSelection}>
            {() => (
                <Checkbox
                    aria-label='Pilih semua baris'
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    onCheckedChange={(checked) => table.getToggleAllRowsSelectedHandler()({ target: { checked } })}
                />
            )}
        </table.Subscribe>
    );
};

const DataTableRowCheckbox = <TData extends RowData>({ row }: DataTableRowCheckboxProps<TData>) => {
    const table = useTableContext();

    return (
        <table.Subscribe source={table.atoms.rowSelection} selector={(rowSelection) => rowSelection[row.id]}>
            {(isSelected) => (
                <Checkbox
                    aria-label='Pilih baris'
                    checked={!!isSelected}
                    disabled={!row.getCanSelect()}
                    onCheckedChange={(checked, details) =>
                        row.getToggleSelectedHandler()({
                            target: { checked },
                            shiftKey: isShiftKey(details.event),
                        })
                    }
                />
            )}
        </table.Subscribe>
    );
};

export type { DataTableRowCheckboxProps };
export { DataTableRowCheckbox, DataTableSelectAllCheckbox };
