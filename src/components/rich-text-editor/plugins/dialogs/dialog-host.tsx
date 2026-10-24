import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { cn } from '@/lib/utils';

import { Dialog, DialogContent } from '@/components/ui/dialog';

type EditorDialogRender = (close: () => void) => React.ReactNode;

type EditorDialogOptions = {
    className?: string;
};

type EditorDialogContextValue = {
    open: (render: EditorDialogRender, options?: EditorDialogOptions) => void;
    close: () => void;
};

type EditorDialogState = {
    render: EditorDialogRender;
    options?: EditorDialogOptions;
};

const EditorDialogContext = React.createContext<EditorDialogContextValue | null>(null);

function useEditorDialog() {
    const context = React.useContext(EditorDialogContext);
    if (!context) throw new Error('useEditorDialog must be used within an EditorRoot');

    return context;
}

function EditorDialogProvider({ children }: { children: React.ReactNode }) {
    const [editor] = useLexicalComposerContext();
    const [dialog, setDialog] = React.useState<EditorDialogState | null>(null);
    const [open, setOpen] = React.useState(false);

    const context: EditorDialogContextValue = {
        open: (render, options) => {
            setDialog({ render, options });
            setOpen(true);
        },
        close: () => setOpen(false),
    };

    const finalFocus = () => {
        editor.focus();
        return false;
    };

    return (
        <EditorDialogContext.Provider value={context}>
            {children}
            <Dialog open={open} onOpenChange={setOpen} onOpenChangeComplete={(next) => !next && setDialog(null)}>
                {dialog && (
                    <DialogContent finalFocus={finalFocus} className={cn('sm:max-w-md', dialog.options?.className)}>
                        {dialog.render(context.close)}
                    </DialogContent>
                )}
            </Dialog>
        </EditorDialogContext.Provider>
    );
}

export type { EditorDialogOptions, EditorDialogRender };
export { EditorDialogProvider, useEditorDialog };
