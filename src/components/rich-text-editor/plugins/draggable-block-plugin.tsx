import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';
import { IconGripVertical, IconPlus } from '@tabler/icons-react';
import { $createParagraphNode, $createTextNode, $getNearestNodeFromDOMNode, $isParagraphNode } from 'lexical';

import { cn } from '@/lib/utils';

import { useEditorAnchor } from '@/components/rich-text-editor/editor-root';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const HANDLE_SLOT = 'editor-drag-handle';

function isOnHandle(element: HTMLElement) {
    return element.closest(`[data-slot='${HANDLE_SLOT}']`) !== null;
}

const handleButtonClassName =
    "flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg:not([class*='size-'])]:size-4";

function DraggableBlockPlugin() {
    const [editor] = useLexicalComposerContext();
    const anchor = useEditorAnchor();
    const menuRef = React.useRef<HTMLDivElement>(null);
    const targetLineRef = React.useRef<HTMLDivElement>(null);
    const blockElementRef = React.useRef<HTMLElement | null>(null);

    const handleElementChanged = (element: HTMLElement | null) => {
        blockElementRef.current = element;
    };

    const insertBlock = () => {
        const element = blockElementRef.current;
        if (!element) return;

        editor.getRootElement()?.focus({ preventScroll: true });
        editor.update(() => {
            const node = $getNearestNodeFromDOMNode(element);
            if (!node) return;

            const isEmptyParagraph = $isParagraphNode(node) && node.getTextContentSize() === 0;
            const paragraph = isEmptyParagraph ? node : $createParagraphNode();
            if (!isEmptyParagraph) node.insertAfter(paragraph);

            paragraph.append($createTextNode('/'));
            paragraph.selectEnd();
        });
    };

    if (!anchor) return null;

    return (
        <DraggableBlockPlugin_EXPERIMENTAL
            anchorElem={anchor}
            menuRef={menuRef}
            targetLineRef={targetLineRef}
            isOnMenu={isOnHandle}
            onElementChanged={handleElementChanged}
            menuComponent={
                <div
                    ref={menuRef}
                    data-slot={HANDLE_SLOT}
                    className='absolute top-0 left-0 z-10 flex items-center opacity-0 will-change-transform'
                >
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <button
                                    type='button'
                                    aria-label='Tambah blok'
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={insertBlock}
                                    className={handleButtonClassName}
                                />
                            }
                        >
                            <IconPlus />
                        </TooltipTrigger>
                        <TooltipContent>Tambah blok</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <div
                                    role='button'
                                    tabIndex={-1}
                                    aria-label='Seret untuk memindahkan'
                                    className={cn(handleButtonClassName, 'cursor-grab active:cursor-grabbing')}
                                />
                            }
                        >
                            <IconGripVertical />
                        </TooltipTrigger>
                        <TooltipContent>Seret untuk memindahkan</TooltipContent>
                    </Tooltip>
                </div>
            }
            targetLineComponent={
                <div
                    ref={targetLineRef}
                    data-slot='editor-drag-target-line'
                    className='pointer-events-none absolute top-0 left-0 h-1 rounded-full bg-primary opacity-0 will-change-transform'
                />
            }
        />
    );
}

export { DraggableBlockPlugin };
