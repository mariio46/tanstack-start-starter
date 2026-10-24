import { createFileRoute } from '@tanstack/react-router';

import { meta } from '@/integrations/tanstack-router/utils';

import { FormMain } from '@/features/components/form/index/main';

export const Route = createFileRoute('/components/form')({
    component: FormPage,
    staticData: {
        breadcrumb: 'Form',
    },
    head: () => ({
        meta: meta({ title: 'Form' }),
    }),
});

function FormPage() {
    return <FormMain />;
}
