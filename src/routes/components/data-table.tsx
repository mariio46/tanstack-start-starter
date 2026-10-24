import { createFileRoute } from '@tanstack/react-router';

import { meta } from '@/integrations/tanstack-router/utils';

import { DataTableMain } from '@/features/components/data-table/index/main';

export const Route = createFileRoute('/components/data-table')({
    component: DataTablePage,
    staticData: {
        breadcrumb: 'Data Table',
    },
    head: () => ({
        meta: meta({ title: 'Data Table' }),
    }),
});

function DataTablePage() {
    return <DataTableMain />;
}
