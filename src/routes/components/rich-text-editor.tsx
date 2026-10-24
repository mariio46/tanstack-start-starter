import { createFileRoute } from '@tanstack/react-router';

import { meta } from '@/integrations/tanstack-router/utils';

import { ExamplePage } from '@/components/custom/example-section';
import { Skeleton } from '@/components/ui/skeleton';

import { RichTextEditorMain } from '@/features/components/rich-text-editor/index/main';

export const Route = createFileRoute('/components/rich-text-editor')({
    ssr: false,
    component: RichTextEditorPage,
    pendingComponent: RichTextEditorPending,
    staticData: {
        breadcrumb: 'Rich Text Editor',
    },
    head: () => ({
        meta: meta({ title: 'Rich Text Editor' }),
    }),
});

function RichTextEditorPage() {
    return <RichTextEditorMain />;
}

function RichTextEditorPending() {
    return (
        <ExamplePage title='Rich Text Editor' description='Memuat editor…'>
            <Skeleton className='h-[28rem] w-full rounded-xl' />
        </ExamplePage>
    );
}
