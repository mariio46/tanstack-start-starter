import * as React from 'react';

import { IconLink } from '@tabler/icons-react';
import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';

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

import { getCurrentLinkUrl, isValidHttpUrl } from './markdown-adapters';

type EditorLinkPopoverProps = {
    editor: Editor | null;
    disabled?: boolean;
};

function EditorLinkPopover({ editor, disabled = false }: EditorLinkPopoverProps) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');
    const [error, setError] = React.useState('');

    const state = useEditorState({
        editor,
        selector: ({ editor }) =>
            editor && {
                is_link: editor.isActive('link'),
                is_selection_empty: editor.state.selection.empty,
            },
    });

    const isLinkActive = state?.is_link ?? false;
    const isSelectionEmpty = state?.is_selection_empty ?? true;
    const isDisabled = disabled || !editor || (!isLinkActive && isSelectionEmpty);

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);

        if (nextOpen) {
            setValue(getCurrentLinkUrl(editor));
            setError('');
        }
    }

    function handleSubmit() {
        if (!editor) {
            return;
        }

        const href = value.trim();

        if (!isValidHttpUrl(href)) {
            setError('Gunakan URL http atau https yang valid.');
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
        setOpen(false);
        setError('');
    }

    function handleRemove() {
        if (!editor) {
            return;
        }

        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        setOpen(false);
        setError('');
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger
                disabled={isDisabled}
                render={
                    <Button
                        size='icon-sm'
                        variant='ghost'
                        aria-label='Atur tautan'
                        title='Atur tautan'
                        aria-pressed={isLinkActive}
                        className='aria-pressed:bg-muted aria-pressed:text-foreground'
                    />
                }
            >
                <IconLink />
            </PopoverTrigger>
            <PopoverContent align='start' className='w-80'>
                <PopoverHeader>
                    <PopoverTitle>Atur tautan</PopoverTitle>
                    <PopoverDescription>Pilih teks terlebih dahulu, lalu isi URL tujuan.</PopoverDescription>
                </PopoverHeader>

                <div className='grid gap-2'>
                    <Input
                        autoFocus
                        placeholder='https://example.com'
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

                <div className='flex items-center justify-between gap-2'>
                    <Button size='sm' variant='ghost' onClick={handleRemove} disabled={!isLinkActive}>
                        Hapus Link
                    </Button>
                    <div className='flex items-center gap-2'>
                        <Button size='sm' variant='ghost' onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button size='sm' onClick={handleSubmit}>
                            Simpan
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export { EditorLinkPopover };
