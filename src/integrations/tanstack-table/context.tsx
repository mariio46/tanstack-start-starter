import { createTableHook } from '@tanstack/react-table';

import { Content } from '@/components/data-table/content';
import { Pagination } from '@/components/data-table/pagination';
import { RowCount } from '@/components/data-table/row-count';

import { cellContext, headerContext, tableContext } from './contexts';
import { features } from './features';

export const { createAppColumnHelper, useAppTable, useTableContext, useCellContext, useHeaderContext } =
    createTableHook({
        features,
        tableContext,
        cellContext,
        headerContext,
        globalFilterFn: 'includesString',
        tableComponents: { Content, Pagination, RowCount },
    });
