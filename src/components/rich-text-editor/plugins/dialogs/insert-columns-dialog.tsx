import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { COLUMN_LAYOUTS } from '@/components/rich-text-editor/constants';
import { INSERT_LAYOUT_COMMAND } from '@/components/rich-text-editor/extensions/layout';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

function ColumnLayoutPreview({ template }: { template: string }) {
    return (
        <span aria-hidden className='grid h-6 w-16 shrink-0 gap-0.5' style={{ gridTemplateColumns: template }}>
            {template.split(' ').map((track, index) => (
                <span key={`${track}-${index}`} className='rounded-sm bg-muted-foreground/30' />
            ))}
        </span>
    );
}

function InsertColumnsDialog({ close }: { close: () => void }) {
    const [editor] = useLexicalComposerContext();
    const [template, setTemplate] = React.useState(COLUMN_LAYOUTS[0].value);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        editor.dispatchCommand(INSERT_LAYOUT_COMMAND, template);
        close();
    };

    return (
        <form onSubmit={handleSubmit} className='grid gap-4'>
            <DialogHeader>
                <DialogTitle>Sisipkan kolom</DialogTitle>
                <DialogDescription>Pilih tata letak kolom.</DialogDescription>
            </DialogHeader>
            <ToggleGroup
                aria-label='Tata letak kolom'
                orientation='vertical'
                variant='outline'
                spacing={1}
                className='w-full'
                value={[template]}
                onValueChange={(next) => next[0] && setTemplate(next[0])}
            >
                {COLUMN_LAYOUTS.map((layout) => (
                    <ToggleGroupItem
                        key={layout.value}
                        value={layout.value}
                        className='h-auto justify-start gap-3 py-2'
                    >
                        <ColumnLayoutPreview template={layout.value} />
                        {layout.label}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
            <DialogFooter>
                <DialogClose render={<Button type='button' variant='outline' />}>Batal</DialogClose>
                <Button type='submit'>Sisipkan</Button>
            </DialogFooter>
        </form>
    );
}

export { InsertColumnsDialog };
