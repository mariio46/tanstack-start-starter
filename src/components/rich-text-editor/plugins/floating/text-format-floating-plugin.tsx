import * as React from 'react';
import { createPortal } from 'react-dom';

import type { VirtualElement } from '@floating-ui/dom';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { $isCodeNode } from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import type { LexicalEditor } from 'lexical';
import {
    $getSelection,
    $isRangeSelection,
    BLUR_COMMAND,
    COMMAND_PRIORITY_LOW,
    FOCUS_COMMAND,
    registerEventListener,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';

import { useEditorAnchor } from '@/components/rich-text-editor/editor-root';
import { useFormatState } from '@/components/rich-text-editor/plugins/toolbar/editor-toolbar';
import { LinkToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/link-toolbar-plugin';
import { TextFormatToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/text-format-toolbar-plugin';
import { Toolbar } from '@/components/ui/toolbar';

function hasFormattableSelection(editor: LexicalEditor) {
    return editor.getEditorState().read(
        () => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) || selection.isCollapsed()) return false;
            if (selection.getTextContent().trim() === '') return false;

            return [selection.anchor.getNode(), selection.focus.getNode()].every(
                (node) => $findMatchingParent(node, $isCodeNode) === null,
            );
        },
        { editor },
    );
}

function getSelectionRange(editor: LexicalEditor) {
    const root = editor.getRootElement();
    const selection = window.getSelection();
    if (!root || !selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    return root.contains(range.commonAncestorContainer) ? range.cloneRange() : null;
}

function TextFormatFloatingPlugin() {
    const [editor] = useLexicalComposerContext();
    const anchor = useEditorAnchor();
    const { isEditable } = useFormatState();
    const [visible, setVisible] = React.useState(false);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const rangeRef = React.useRef<Range | null>(null);
    const selectingRef = React.useRef(false);
    const updatePositionRef = React.useRef<(() => void) | null>(null);

    const sync = React.useEffectEvent(() => {
        const root = editor.getRootElement();
        const active = document.activeElement;
        const focused = Boolean(root?.contains(active) || panelRef.current?.contains(active));
        const range = focused && !selectingRef.current ? getSelectionRange(editor) : null;
        const next = range !== null && editor.isEditable() && hasFormattableSelection(editor);

        rangeRef.current = next ? range : null;
        setVisible(next);
        if (next) updatePositionRef.current?.();
    });

    React.useEffect(
        () =>
            mergeRegister(
                editor.registerUpdateListener(() => sync()),
                editor.registerCommand(
                    SELECTION_CHANGE_COMMAND,
                    () => {
                        sync();
                        return false;
                    },
                    COMMAND_PRIORITY_LOW,
                ),
                editor.registerCommand(
                    FOCUS_COMMAND,
                    () => {
                        sync();
                        return false;
                    },
                    COMMAND_PRIORITY_LOW,
                ),
                editor.registerCommand(
                    BLUR_COMMAND,
                    (event) => {
                        if (!panelRef.current?.contains(event.relatedTarget as Node | null)) setVisible(false);
                        return false;
                    },
                    COMMAND_PRIORITY_LOW,
                ),
                editor.registerRootListener((root) => {
                    if (!root) return;

                    const handlePointerUp = () => {
                        selectingRef.current = false;
                        sync();
                    };
                    const handlePointerDown = (event: PointerEvent) => {
                        if (event.button !== 0) return;

                        selectingRef.current = true;
                        setVisible(false);
                        document.addEventListener('pointerup', handlePointerUp, { once: true });
                    };

                    const unregister = registerEventListener(root, 'pointerdown', handlePointerDown);
                    return () => {
                        unregister();
                        document.removeEventListener('pointerup', handlePointerUp);
                    };
                }),
            ),
        [editor],
    );

    React.useEffect(() => {
        if (!isEditable) setVisible(false);
    }, [isEditable]);

    React.useLayoutEffect(() => {
        const panel = panelRef.current;
        const root = editor.getRootElement();
        if (!visible || !panel || !root) return;

        const reference: VirtualElement = {
            contextElement: root,
            getBoundingClientRect: () => rangeRef.current?.getBoundingClientRect() ?? root.getBoundingClientRect(),
        };

        const update = () => {
            computePosition(reference, panel, {
                placement: 'top',
                middleware: [offset(8), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
                panel.style.left = `${x}px`;
                panel.style.top = `${y}px`;
            });
        };

        updatePositionRef.current = update;
        const cleanup = autoUpdate(reference, panel, update);

        return () => {
            updatePositionRef.current = null;
            cleanup();
        };
    }, [editor, visible]);

    if (!anchor || !visible) return null;

    return createPortal(
        <div
            ref={panelRef}
            data-slot='editor-floating-toolbar'
            onMouseDown={(event) => event.preventDefault()}
            className='absolute top-0 left-0 z-50 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10'
        >
            <Toolbar aria-label='Format teks' className='gap-0.5'>
                <TextFormatToolbarPlugin />
                <LinkToolbarPlugin />
            </Toolbar>
        </div>,
        anchor,
    );
}

export { TextFormatFloatingPlugin };
