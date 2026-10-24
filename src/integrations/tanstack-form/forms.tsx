import { IconAlertTriangle } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { useFormContext } from './context';
import { FORM_ERROR_KEY } from './utils';

interface SubmitButtonProps extends Omit<React.ComponentProps<typeof Button>, 'type' | 'children' | 'render'> {
    label?: React.ReactNode;
    pendingLabel?: React.ReactNode;
}

export const SubmitButton = ({
    className,
    label = 'Simpan',
    pendingLabel = 'Memproses...',
    disabled,
    ...props
}: SubmitButtonProps) => {
    const form = useFormContext();

    return (
        <form.Subscribe
            selector={(state) => [state.canSubmit, state.isValidating, state.isSubmitting]}
            children={([canSubmit, isValidating, isSubmitting]) => {
                const isPending = isSubmitting;
                const isDisabled = disabled || !canSubmit || isSubmitting || isValidating;

                return (
                    <Button type='submit' disabled={isDisabled} className={cn('font-semibold', className)} {...props}>
                        {isPending && <Spinner />}
                        {isPending ? pendingLabel : label}
                    </Button>
                );
            }}
        />
    );
};

interface AlertErrorProps extends Omit<React.ComponentProps<typeof Alert>, 'variant' | 'children' | 'title'> {
    title?: React.ReactNode;
}

export const AlertError = ({ title = 'Terjadi kesalahan', ...props }: AlertErrorProps) => {
    const form = useFormContext();

    return (
        <form.Subscribe
            selector={(state) => {
                const errors = state.errorMap.onSubmit as Record<string, Array<{ message?: string }>> | undefined;

                return errors?.[FORM_ERROR_KEY]?.[0]?.message;
            }}
            children={(message) =>
                message ? (
                    <Alert variant='destructive' {...props}>
                        <IconAlertTriangle />
                        <AlertTitle>{title}</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                ) : null
            }
        />
    );
};
