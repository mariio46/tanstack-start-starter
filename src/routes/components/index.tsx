import { createFileRoute, Link, type LinkProps } from '@tanstack/react-router';

import { IconChevronRight } from '@tabler/icons-react';

import { meta } from '@/integrations/tanstack-router/utils';

import { ExamplePage } from '@/components/custom/example-section';

export const Route = createFileRoute('/components/')({
    component: ComponentsPage,
    head: () => ({
        meta: meta({ title: 'Components' }),
    }),
});

interface ComponentCard {
    to: NonNullable<LinkProps['to']>;
    title: string;
    description: string;
}

const COMPONENTS: ComponentCard[] = [
    {
        to: '/components/data-table',
        title: 'Data Table',
        description:
            'Sorting, pagination, pencarian, faceted filter, rentang tanggal, row selection, dan virtualisasi.',
    },
    {
        to: '/components/form',
        title: 'Form',
        description:
            'Semua field component TanStack Form: teks, pilihan, tanggal, file, markdown, validasi, dan form blocker.',
    },
];

function ComponentsPage() {
    return (
        <ExamplePage
            title='Components'
            description='Contoh langsung untuk komponen bersama di aplikasi ini. Semua halaman memakai data statis.'
        >
            <div className='grid gap-4 sm:grid-cols-2'>
                {COMPONENTS.map((component) => (
                    <Link
                        key={component.to}
                        to={component.to}
                        className='group grid gap-1 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50 sm:p-6'
                    >
                        <span className='flex items-center gap-1 font-semibold text-base/5'>
                            {component.title}
                            <IconChevronRight className='size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
                        </span>
                        <span className='text-muted-foreground text-sm'>{component.description}</span>
                    </Link>
                ))}
            </div>
        </ExamplePage>
    );
}
