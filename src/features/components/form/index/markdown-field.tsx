import * as React from 'react';

import { formOptions } from '@tanstack/react-form';

import { useAppForm } from '@/integrations/tanstack-form/context';

import { Form } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';

import { MARKDOWN_SAMPLE } from './constants';
import { markdownFieldSchema } from './schema';

const LazyMarkdownViewer = React.lazy(() =>
    import('@/components/custom/markdown-editor/markdown-viewer').then((module) => ({
        default: module.MarkdownViewer,
    })),
);

const markdownFieldFormOptions = formOptions({
    validators: {
        onSubmit: markdownFieldSchema,
    },
    defaultValues: {
        content: MARKDOWN_SAMPLE,
    },
});

const MarkdownFieldForm = () => {
    const [submitted, setSubmitted] = React.useState<string>();

    const form = useAppForm({
        ...markdownFieldFormOptions,
        onSubmit: ({ value }) => {
            setSubmitted(value.content);
        },
    });

    async function submit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        await form.handleSubmit();
    }

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <Form id='markdown-field-form' className='grid content-start gap-4' onSubmit={submit}>
                <form.AppField name='content'>
                    {(field) => <field.MarkdownEditor label='Konten' minHeight='16rem' />}
                </form.AppField>

                <form.AppForm>
                    <form.SubmitButton className='justify-self-start' />
                </form.AppForm>
            </Form>

            <div className='grid content-start gap-2'>
                <span className='font-medium text-sm/4'>Hasil render</span>
                {submitted === undefined ? (
                    <p className='rounded-lg border border-dashed p-4 text-muted-foreground text-sm'>
                        Belum ada data. Tekan Simpan untuk merender markdown.
                    </p>
                ) : (
                    <div className='rounded-lg border p-4'>
                        <React.Suspense fallback={<Skeleton className='h-40 w-full rounded-lg' />}>
                            <LazyMarkdownViewer value={submitted} />
                        </React.Suspense>
                    </div>
                )}
            </div>
        </div>
    );
};

export { MarkdownFieldForm };
