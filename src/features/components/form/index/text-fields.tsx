import * as React from 'react';

import { formOptions } from '@tanstack/react-form';

import { useAppForm } from '@/integrations/tanstack-form/context';

import type { JsonValue } from '@/components/custom/json-viewer';
import { Form } from '@/components/ui/form';
import { InputGroupAddon, InputGroupText } from '@/components/ui/input-group';

import { textFieldsDefaultValues, textFieldsSchema } from './schema';
import { SubmittedValue } from './submitted-value';

const textFieldsFormOptions = formOptions({
    validators: {
        onSubmit: textFieldsSchema,
    },
    defaultValues: textFieldsDefaultValues,
});

const TextFieldsForm = () => {
    const [submitted, setSubmitted] = React.useState<JsonValue>();

    const form = useAppForm({
        ...textFieldsFormOptions,
        onSubmit: ({ value }) => {
            setSubmitted({ ...value, salary: value.salary ?? null });
        },
    });

    async function submit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        await form.handleSubmit();
    }

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <Form id='text-fields-form' className='grid gap-4' onSubmit={submit}>
                <form.AppField name='name'>
                    {(field) => <field.Input label='Nama' placeholder='Masukkan nama lengkap' autoComplete='off' />}
                </form.AppField>

                <form.AppField name='password'>
                    {(field) => (
                        <field.InputPassword
                            label='Password'
                            placeholder='Minimal 8 karakter'
                            autoComplete='new-password'
                        />
                    )}
                </form.AppField>

                <form.AppField name='salary'>
                    {(field) => <field.InputNumber label='Gaji' prefix='Rp' placeholder='5000000' />}
                </form.AppField>

                <form.AppField name='username'>
                    {(field) => (
                        <field.InputGroup
                            label='Username'
                            placeholder='nama_pengguna'
                            autoComplete='off'
                            addon={
                                <InputGroupAddon align='inline-start'>
                                    <InputGroupText>@</InputGroupText>
                                </InputGroupAddon>
                            }
                        />
                    )}
                </form.AppField>

                <form.AppField name='bio'>
                    {(field) => <field.Textarea label='Bio' placeholder='Ceritakan sedikit tentang dirimu' />}
                </form.AppField>

                <form.AppForm>
                    <form.SubmitButton className='justify-self-start' />
                </form.AppForm>
            </Form>

            <SubmittedValue value={submitted} />
        </div>
    );
};

export { TextFieldsForm };
