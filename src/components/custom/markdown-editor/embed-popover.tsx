import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '@/components/ui/popover';

type EditorEmbedPopoverProps = {
    description?: string;
    disabled?: boolean;
    getInitialValue?: () => string;
    placeholder: string;
    submitLabel: string;
    title: string;
    triggerIcon: React.ReactNode;
    triggerLabel: string;
    validate?: (value: string) => string | undefined;
    onSubmit: (value: string) => boolean | undefined;
};

function EditorEmbedPopover({
    description,
    disabled = false,
    getInitialValue,
    placeholder,
    submitLabel,
    title,
    triggerIcon,
    triggerLabel,
    validate,
    onSubmit,
}: EditorEmbedPopoverProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState('');

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);

        if (nextOpen) {
            setValue(getInitialValue?.() ?? '');
            setError('');
        }
    }

    function handleSubmit() {
        const nextValue = value.trim();
        const nextError = validate?.(nextValue);

        if (nextError) {
            setError(nextError);
            return;
        }

        const shouldClose = onSubmit(nextValue);

        if (shouldClose !== false) {
            setOpen(false);
            setError('');
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger
                disabled={disabled}
                render={<Button size='icon-sm' variant='ghost' aria-label={triggerLabel} title={triggerLabel} />}
            >
                {triggerIcon}
            </PopoverTrigger>
            <PopoverContent align='start' className='w-80'>
                <PopoverHeader>
                    <PopoverTitle>{title}</PopoverTitle>
                    {description ? <PopoverDescription>{description}</PopoverDescription> : null}
                </PopoverHeader>

                <div className='grid gap-2'>
                    <Input
                        autoFocus
                        placeholder={placeholder}
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                    {error ? <p className='text-destructive text-xs'>{error}</p> : null}
                </div>

                <div className='flex items-center justify-end gap-2'>
                    <Button size='sm' variant='ghost' onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button size='sm' onClick={handleSubmit}>
                        {submitLabel}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export { EditorEmbedPopover };
