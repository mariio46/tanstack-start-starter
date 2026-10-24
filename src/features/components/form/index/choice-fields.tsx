import * as React from 'react';

import { formOptions } from '@tanstack/react-form';
import type { QueryStatus } from '@tanstack/react-query';

import { useAppForm } from '@/integrations/tanstack-form/context';

import type { JsonValue } from '@/components/custom/json-viewer';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Form } from '@/components/ui/form';

import {
    ASYNC_STATUSES,
    DIVISION_OPTIONS,
    EMPLOYMENT_TYPE_OPTIONS,
    MANAGER_OPTIONS,
    NOTIFICATION_OPTIONS,
    PERMISSION_GROUPS,
    SKILL_OPTIONS,
} from './constants';
import { choiceFieldsDefaultValues, choiceFieldsSchema } from './schema';
import { SubmittedValue } from './submitted-value';

const choiceFieldsFormOptions = formOptions({
    validators: {
        onSubmit: choiceFieldsSchema,
    },
    defaultValues: choiceFieldsDefaultValues,
});

const ChoiceFieldsForm = () => {
    const [submitted, setSubmitted] = React.useState<JsonValue>();
    const [managerStatus, setManagerStatus] = React.useState<QueryStatus>('success');

    const form = useAppForm({
        ...choiceFieldsFormOptions,
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
            <Form id='choice-fields-form' className='grid gap-4' onSubmit={submit}>
                <form.AppField name='division'>
                    {(field) => <field.Combobox label='Divisi' items={DIVISION_OPTIONS} async={false} />}
                </form.AppField>

                <div className='grid gap-2'>
                    <ButtonGroup aria-label='Status data atasan'>
                        {ASYNC_STATUSES.map((status) => (
                            <Button
                                key={status.value}
                                type='button'
                                size='xs'
                                variant={managerStatus === status.value ? 'default' : 'outline'}
                                onClick={() => setManagerStatus(status.value)}
                            >
                                {status.label}
                            </Button>
                        ))}
                    </ButtonGroup>

                    <form.AppField name='manager'>
                        {(field) => (
                            <field.Combobox
                                label='Atasan'
                                items={managerStatus === 'success' ? MANAGER_OPTIONS : undefined}
                                async
                                status={managerStatus}
                                disabled={false}
                            />
                        )}
                    </form.AppField>
                </div>

                <form.AppField name='skills'>
                    {(field) => <field.ComboboxMultiple label='Skill' items={SKILL_OPTIONS} async={false} />}
                </form.AppField>

                <form.AppField name='employment_type'>
                    {(field) => <field.RadioCards label='Tipe Karyawan' items={EMPLOYMENT_TYPE_OPTIONS} />}
                </form.AppField>

                <form.AppField name='notifications'>
                    {(field) => <field.CheckboxCards label='Kanal Notifikasi' items={NOTIFICATION_OPTIONS} />}
                </form.AppField>

                <form.AppField name='permissions'>
                    {(field) => (
                        <field.CheckboxGroups
                            label='Permission'
                            groups={PERMISSION_GROUPS}
                            searchPlaceholder='Cari permission'
                        />
                    )}
                </form.AppField>

                <form.AppField name='agreement'>
                    {(field) => (
                        <field.Checkbox
                            label='Saya menyetujui kebijakan perusahaan'
                            description='Wajib dicentang sebelum data disimpan.'
                        />
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

export { ChoiceFieldsForm };
