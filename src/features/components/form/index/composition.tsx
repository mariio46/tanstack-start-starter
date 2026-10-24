import * as React from 'react';

import { formOptions } from '@tanstack/react-form';

import { IconCopy } from '@tabler/icons-react';

import { useAppForm, withFieldGroup, withForm } from '@/integrations/tanstack-form/context';

import type { JsonValue } from '@/components/custom/json-viewer';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { addressDefaultValues, compositionDefaultValues, compositionSchema } from './schema';
import { SubmittedValue } from './submitted-value';

const compositionFormOptions = formOptions({
    validators: {
        onSubmit: compositionSchema,
    },
    defaultValues: compositionDefaultValues,
});

const AddressFieldGroup = withFieldGroup({
    defaultValues: addressDefaultValues,
    props: {
        title: 'Alamat',
    },
    render: function Render({ group, title }) {
        return (
            <fieldset className='grid gap-4 rounded-lg border p-4'>
                <legend className='px-1 font-medium text-sm'>{title}</legend>

                <group.AppField name='street'>
                    {(field) => <field.Input label='Jalan' placeholder='Jl. Merdeka No. 10' autoComplete='off' />}
                </group.AppField>

                <div className='grid gap-4 sm:grid-cols-2'>
                    <group.AppField name='city'>
                        {(field) => <field.Input label='Kota' placeholder='Bandung' autoComplete='off' />}
                    </group.AppField>

                    <group.AppField name='postal_code'>
                        {(field) => (
                            <field.Input label='Kode Pos' placeholder='40111' inputMode='numeric' autoComplete='off' />
                        )}
                    </group.AppField>
                </div>
            </fieldset>
        );
    },
});

const CompanyFields = withForm({
    ...compositionFormOptions,
    render: function Render({ form }) {
        return (
            <div className='grid gap-4'>
                <form.AppField name='company'>
                    {(field) => <field.Input label='Nama Perusahaan' placeholder='PT Contoh Jaya' autoComplete='off' />}
                </form.AppField>

                <AddressFieldGroup form={form} fields='billing' title='Alamat Penagihan' />

                <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='justify-self-start'
                    onClick={() => form.setFieldValue('shipping', form.getFieldValue('billing'))}
                >
                    <IconCopy data-icon='inline-start' />
                    Salin dari alamat penagihan
                </Button>

                <AddressFieldGroup form={form} fields='shipping' title='Alamat Pengiriman' />
            </div>
        );
    },
});

const CompositionForm = () => {
    const [submitted, setSubmitted] = React.useState<JsonValue>();

    const form = useAppForm({
        ...compositionFormOptions,
        onSubmit: ({ value }) => {
            setSubmitted(value);
        },
    });

    async function submit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        await form.handleSubmit();
    }

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <Form id='composition-form' className='grid content-start gap-4' onSubmit={submit}>
                <CompanyFields form={form} />

                <form.AppForm>
                    <form.SubmitButton className='justify-self-start' />
                </form.AppForm>
            </Form>

            <SubmittedValue value={submitted} />
        </div>
    );
};

export { CompositionForm };
