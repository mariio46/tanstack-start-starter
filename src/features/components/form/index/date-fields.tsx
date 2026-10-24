import * as React from 'react';

import { formOptions } from '@tanstack/react-form';

import { useAppForm } from '@/integrations/tanstack-form/context';

import type { JsonValue } from '@/components/custom/json-viewer';
import { Form } from '@/components/ui/form';

import { BIRTH_DATE_MAX, BIRTH_DATE_MIN, LEAVE_DATES_MAX, SCHEDULE_DATE_MIN } from './constants';
import { dateFieldsDefaultValues, dateFieldsSchema } from './schema';
import { SubmittedValue } from './submitted-value';

const dateFieldsFormOptions = formOptions({
    validators: {
        onSubmit: dateFieldsSchema,
    },
    defaultValues: dateFieldsDefaultValues,
});

const DateFieldsForm = () => {
    const [submitted, setSubmitted] = React.useState<JsonValue>();

    const form = useAppForm({
        ...dateFieldsFormOptions,
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
            <Form id='date-fields-form' className='grid gap-4' onSubmit={submit}>
                <form.AppField name='birth_date'>
                    {(field) => (
                        <field.InputDate label='Tanggal Lahir' minDate={BIRTH_DATE_MIN} maxDate={BIRTH_DATE_MAX} />
                    )}
                </form.AppField>

                <form.AppField name='scheduled_at'>
                    {(field) => <field.InputDateTime label='Jadwal Wawancara' minDate={SCHEDULE_DATE_MIN} />}
                </form.AppField>

                <form.AppField name='leave_dates'>
                    {(field) => (
                        <field.InputDateMultiple
                            label='Tanggal Cuti'
                            description={`Pilih sampai ${LEAVE_DATES_MAX} tanggal, akhir pekan tidak bisa dipilih.`}
                            minDate={SCHEDULE_DATE_MIN}
                            max={LEAVE_DATES_MAX}
                            disabledDates={[{ dayOfWeek: [0, 6] }]}
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

export { DateFieldsForm };
