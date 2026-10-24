import * as React from 'react';

import { formOptions } from '@tanstack/react-form';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';

import { useAppForm, withForm } from '@/integrations/tanstack-form/context';

import { useFormBlocker } from '@/components/custom/form-blocker';
import { FormBlockerDialog } from '@/components/custom/form-blocker-dialog';
import type { JsonValue } from '@/components/custom/json-viewer';
import { Button } from '@/components/ui/button';
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { type BlockerPayload, blockerDefaultValues, blockerSchema } from './schema';
import { SubmittedValue } from './submitted-value';

const blockerDialogHandle = DialogPrimitive.createHandle();

const blockerFormOptions = formOptions({
    validators: {
        onSubmit: blockerSchema,
    },
    defaultValues: blockerDefaultValues,
});

const BlockerFields = withForm({
    ...blockerFormOptions,
    render: function Render({ form }) {
        return (
            <div className='grid gap-4'>
                <form.AppField name='title'>
                    {(field) => <field.Input label='Judul' placeholder='Judul catatan' autoComplete='off' />}
                </form.AppField>

                <form.AppField name='note'>
                    {(field) => <field.Textarea label='Catatan' placeholder='Tulis sesuatu' />}
                </form.AppField>
            </div>
        );
    },
});

type BlockerFormProps = {
    onSubmitted: (value: BlockerPayload) => void;
};

const InlineBlockerForm = ({ onSubmitted }: BlockerFormProps) => {
    const form = useAppForm({
        ...blockerFormOptions,
        onSubmit: ({ value, formApi }) => {
            onSubmitted(value);
            formApi.reset();
        },
    });

    useFormBlocker(form);

    async function submit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        await form.handleSubmit();
    }

    return (
        <Form id='inline-blocker-form' className='grid gap-4' onSubmit={submit}>
            <BlockerFields form={form} />

            <form.AppForm>
                <form.SubmitButton className='justify-self-start' />
            </form.AppForm>
        </Form>
    );
};

const DialogBlockerForm = ({ onSubmitted }: BlockerFormProps) => {
    const form = useAppForm({
        ...blockerFormOptions,
        onSubmit: ({ value, formApi }) => {
            onSubmitted(value);
            formApi.reset();
            blockerDialogHandle.close();
        },
    });

    useFormBlocker(form);

    async function submit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        await form.handleSubmit();
    }

    return (
        <>
            <Form id='dialog-blocker-form' className='grid gap-4' onSubmit={submit}>
                <BlockerFields form={form} />
            </Form>
            <DialogFooter>
                <DialogClose render={<Button variant='outline' />}>Batal</DialogClose>
                <form.AppForm>
                    <form.SubmitButton form='dialog-blocker-form' />
                </form.AppForm>
            </DialogFooter>
        </>
    );
};

const BlockerForm = () => {
    const [submitted, setSubmitted] = React.useState<JsonValue>();

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <div className='grid content-start gap-4'>
                <p className='text-muted-foreground text-sm'>
                    Ubah form ini lalu klik link Beranda di navbar — navigasi ditahan sampai perubahan dibuang.
                </p>
                <InlineBlockerForm onSubmitted={setSubmitted} />
            </div>

            <div className='grid content-start gap-4'>
                <p className='text-muted-foreground text-sm'>
                    Buka dialog, isi form, lalu tekan Esc, klik di luar dialog, atau tekan Batal.
                </p>
                <DialogTrigger
                    handle={blockerDialogHandle}
                    render={<Button variant='outline' className='justify-self-start' />}
                >
                    Buka dialog
                </DialogTrigger>

                <SubmittedValue value={submitted} />
            </div>

            <FormBlockerDialog handle={blockerDialogHandle}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Catatan Baru</DialogTitle>
                        <DialogDescription>
                            Dialog ini dibungkus FormBlockerDialog, jadi menutupnya saat form dirty meminta konfirmasi.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogBlockerForm onSubmitted={setSubmitted} />
                </DialogContent>
            </FormBlockerDialog>
        </div>
    );
};

export { BlockerForm };
