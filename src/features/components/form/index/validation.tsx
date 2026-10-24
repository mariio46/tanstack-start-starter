import * as React from 'react';

import { formOptions } from '@tanstack/react-form';

import { useAppForm } from '@/integrations/tanstack-form/context';
import { toFormErrorMap } from '@/integrations/tanstack-form/utils';

import { type JsonValue, JsonViewer } from '@/components/custom/json-viewer';
import { Form } from '@/components/ui/form';

import { TAKEN_EMAIL } from './constants';
import { validationDefaultValues, validationSchema } from './schema';
import { SubmittedValue } from './submitted-value';

const SERVER_DELAY = 1200;

const validationFormOptions = formOptions({
    validators: {
        onSubmit: validationSchema,
    },
    defaultValues: validationDefaultValues,
});

function wait(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

const ValidationForm = () => {
    const [submitted, setSubmitted] = React.useState<JsonValue>();

    const form = useAppForm({
        ...validationFormOptions,
        onSubmit: async ({ value, formApi }) => {
            await wait(SERVER_DELAY);

            if (value.email === TAKEN_EMAIL) {
                formApi.setErrorMap({
                    onSubmit: toFormErrorMap(
                        { message: 'Data gagal disimpan.', fields: { email: 'Email sudah terdaftar.' } },
                        Object.keys(validationDefaultValues),
                    ),
                });

                return;
            }

            setSubmitted(value);
            formApi.reset(value);
        },
    });

    async function submit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        await form.handleSubmit();
    }

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <Form id='validation-form' className='grid content-start gap-4' onSubmit={submit}>
                <form.AppForm>
                    <form.AlertError title='Gagal menyimpan' />
                </form.AppForm>

                <form.AppField name='name'>
                    {(field) => <field.Input label='Nama' placeholder='Masukkan nama' autoComplete='off' />}
                </form.AppField>

                <form.AppField name='email' validators={{ onBlur: validationSchema.shape.email }}>
                    {(field) => <field.Input label='Email' type='email' placeholder={TAKEN_EMAIL} autoComplete='off' />}
                </form.AppField>

                <form.AppForm>
                    <form.SubmitButton className='justify-self-start' pendingLabel='Menyimpan...' />
                </form.AppForm>
            </Form>

            <div className='grid content-start gap-4'>
                <form.Subscribe
                    selector={(state) => ({
                        is_dirty: state.isDirty,
                        is_valid: state.isValid,
                        is_submitting: state.isSubmitting,
                        can_submit: state.canSubmit,
                        submission_attempts: state.submissionAttempts,
                    })}
                >
                    {(state) => (
                        <div className='grid gap-2'>
                            <span className='font-medium text-sm/4'>State form</span>
                            <JsonViewer data={state} rootName='state' defaultExpanded />
                        </div>
                    )}
                </form.Subscribe>

                <SubmittedValue value={submitted} />
            </div>
        </div>
    );
};

export { ValidationForm };
