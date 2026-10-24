import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView } from '@lexical/react/LexicalTreeView';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/button';

const TREE_BUTTON_CLASS_NAME = cn(buttonVariants({ variant: 'outline', size: 'xs' }), 'me-2 mb-2');

function TreeViewPlugin({ className }: { className?: string }) {
    const [editor] = useLexicalComposerContext();

    return (
        <div
            data-slot='editor-tree-view'
            className={cn(
                'max-h-80 shrink-0 overflow-auto border-t bg-muted/40 p-3 font-mono text-xs [&_pre]:whitespace-pre',
                className,
            )}
        >
            <TreeView
                editor={editor}
                treeTypeButtonClassName={TREE_BUTTON_CLASS_NAME}
                timeTravelButtonClassName={TREE_BUTTON_CLASS_NAME}
                timeTravelPanelClassName='mt-2 flex items-center gap-2'
                timeTravelPanelButtonClassName={buttonVariants({ variant: 'outline', size: 'xs' })}
                timeTravelPanelSliderClassName='flex-1 accent-primary'
            />
        </div>
    );
}

export { TreeViewPlugin };
