import * as React from 'react';

import { formOptions } from '@tanstack/react-form';

import { useAppForm } from '@/integrations/tanstack-form/context';

import { getRichTextLength, parseRichText } from '@/lib/rich-text';

import type { JsonValue } from '@/components/custom/json-viewer';
import { Form } from '@/components/ui/form';

import { RICH_TEXT_CONSTRAINTS } from './constants';
import { richTextFieldDefaultValues, richTextFieldSchema } from './schema';
import { SubmittedValue } from './submitted-value';

const richTextFieldFormOptions = formOptions({
    validators: {
        onSubmit: richTextFieldSchema,
    },
    defaultValues: richTextFieldDefaultValues,
});

const RichTextFieldForm = () => {
    const [submitted, setSubmitted] = React.useState<JsonValue>();

    const form = useAppForm({
        ...richTextFieldFormOptions,
        onSubmit: ({ value }) => {
            setSubmitted({
                length: getRichTextLength(value.content),
                document: (parseRichText(value.content) as JsonValue | null) ?? null,
            });
        },
    });

    async function submit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        await form.handleSubmit();
    }

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <Form id='rich-text-field-form' className='grid min-w-0 content-start gap-4' onSubmit={submit}>
                <form.AppField name='content'>
                    {(field) => (
                        <field.RichTextEditor
                            label='Konten'
                            maxLength={RICH_TEXT_CONSTRAINTS.maxLength}
                            placeholder={`Tulis maksimal ${RICH_TEXT_CONSTRAINTS.maxLength} karakter…`}
                            className='h-80'
                        />
                    )}
                </form.AppField>

                <form.AppForm>
                    <form.SubmitButton className='justify-self-start' />
                </form.AppForm>
            </Form>

            <SubmittedValue value={submitted} defaultExpanded={2} />
        </div>
    );
};

export { RichTextFieldForm };
