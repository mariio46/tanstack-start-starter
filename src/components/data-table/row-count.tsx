import { useTableContext } from '@/integrations/tanstack-table/contexts';

const RowCount = () => {
    const table = useTableContext();

    return (
        <table.Subscribe selector={(state) => state.pagination}>
            {({ pageIndex, pageSize }) => {
                const rowCount = table.getRowCount();

                const from = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
                const to = Math.min((pageIndex + 1) * pageSize, rowCount);

                return (
                    <p className='text-muted-foreground text-xs'>
                        {`Menampilkan ${from.toLocaleString('id-ID')} sampai ${to.toLocaleString('id-ID')} dari ${rowCount.toLocaleString('id-ID')}`}
                    </p>
                );
            }}
        </table.Subscribe>
    );
};

export { RowCount };
