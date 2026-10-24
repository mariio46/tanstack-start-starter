import * as React from 'react';

import { formOptions } from '@tanstack/react-form';

import { useAppForm } from '@/integrations/tanstack-form/context';

import { formatFileSize, formatFileType } from '@/lib/file';

import type { JsonValue } from '@/components/custom/json-viewer';
import { Form } from '@/components/ui/form';

import { ATTACHMENT_CONSTRAINTS, PHOTO_MAX_SIZE, PHOTO_MIMES } from './constants';
import { fileFieldsDefaultValues, fileFieldsSchema } from './schema';
import { SubmittedValue } from './submitted-value';

const fileFieldsFormOptions = formOptions({
    validators: {
        onSubmit: fileFieldsSchema,
    },
    defaultValues: fileFieldsDefaultValues,
});

function describeFiles(files: File[]) {
    return files.map((file) => ({
        name: file.name,
        size: formatFileSize(file.size),
        type: formatFileType(file),
    }));
}

const FileFieldsForm = () => {
    const [submitted, setSubmitted] = React.useState<JsonValue>();

    const form = useAppForm({
        ...fileFieldsFormOptions,
        onSubmit: ({ value }) => {
            setSubmitted({
                attachments: describeFiles(value.attachments),
                photo: describeFiles(value.photo),
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
            <Form id='file-fields-form' className='grid gap-4' onSubmit={submit}>
                <form.AppField name='attachments'>
                    {(field) => (
                        <field.InputFile
                            label='Lampiran'
                            multiple={ATTACHMENT_CONSTRAINTS.multiple}
                            accept={ATTACHMENT_CONSTRAINTS.accept}
                            minFiles={ATTACHMENT_CONSTRAINTS.minFiles}
                            maxFiles={ATTACHMENT_CONSTRAINTS.maxFiles}
                            maxSize={ATTACHMENT_CONSTRAINTS.maxSize}
                            maxTotalSize={ATTACHMENT_CONSTRAINTS.maxTotalSize}
                        />
                    )}
                </form.AppField>

                <form.AppField name='photo'>
                    {(field) => (
                        <field.FileUpload label='Foto Profil' max={1} mimes={PHOTO_MIMES} maxSize={PHOTO_MAX_SIZE} />
                    )}
                </form.AppField>

                <form.AppForm>
                    <form.SubmitButton className='justify-self-start' />
                </form.AppForm>
            </Form>

            <SubmittedValue value={submitted} />
        </div>
    );
};

export { FileFieldsForm };
