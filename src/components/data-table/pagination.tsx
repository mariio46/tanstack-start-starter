import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';

import { useTableContext } from '@/integrations/tanstack-table/contexts';

import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

const pageSizeOptions = [1, 5, 10, 15, 20, 30, 40, 50, 100, 500, 1000, 2000, 5000, 10000];

const Pagination = () => {
    const table = useTableContext();

    return (
        <table.Subscribe selector={(state) => state.pagination}>
            {(pagination) => (
                <div className='flex items-center gap-1.5'>
                    <Button
                        size='icon-sm'
                        variant='outline'
                        aria-label='Ke halaman pertama'
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.firstPage()}
                    >
                        <IconChevronsLeft />
                    </Button>
                    <Button
                        size='icon-sm'
                        variant='outline'
                        aria-label='Halaman sebelumnya'
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                    >
                        <IconChevronLeft />
                    </Button>
                    <NativeSelect
                        size='sm'
                        aria-label='Baris per halaman'
                        value={pagination.pageSize}
                        onChange={(event) => {
                            table.setPageSize(Number(event.target.value));
                            table.setPageIndex(0);
                        }}
                    >
                        {pageSizeOptions.map((pageSize) => (
                            <NativeSelectOption key={pageSize} value={pageSize}>
                                {`${pageSize} / halaman`}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>
                    <Button
                        size='icon-sm'
                        variant='outline'
                        aria-label='Halaman berikutnya'
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                    >
                        <IconChevronRight />
                    </Button>
                    <Button
                        size='icon-sm'
                        variant='outline'
                        aria-label='Ke halaman terakhir'
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.lastPage()}
                    >
                        <IconChevronsRight />
                    </Button>
                </div>
            )}
        </table.Subscribe>
    );
};

export { Pagination };
