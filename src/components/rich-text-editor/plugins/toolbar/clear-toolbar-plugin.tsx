import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IconClearAll } from '@tabler/icons-react';
import { CLEAR_EDITOR_COMMAND, CLEAR_HISTORY_COMMAND } from 'lexical';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { EditorToolbarButton, useFormatState } from './editor-toolbar';

function ClearToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { isEditable } = useFormatState();
    const [open, setOpen] = React.useState(false);
    const clearedRef = React.useRef(false);

    const handleClear = () => {
        editor.update(() => editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined), { discrete: true });
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);

        clearedRef.current = true;
        setOpen(false);
    };

    const finalFocus = () => {
        if (!clearedRef.current) return true;

        clearedRef.current = false;
        editor.focus();
        return false;
    };

    return (
        <>
            <EditorToolbarButton label='Kosongkan editor' disabled={!isEditable} onClick={() => setOpen(true)}>
                <IconClearAll />
            </EditorToolbarButton>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent finalFocus={finalFocus}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kosongkan editor?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Semua konten di editor akan dihapus. Tindakan ini tidak bisa dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction variant='destructive' onClick={handleClear}>
                            Kosongkan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export { ClearToolbarPlugin };
