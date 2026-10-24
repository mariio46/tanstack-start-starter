import * as React from 'react';
import { createPortal } from 'react-dom';

import { autoUpdate, computePosition, offset } from '@floating-ui/dom';
import { $isCodeNode, getDefaultCodeLanguage } from '@lexical/code';
import { CODE_LANGUAGE_FRIENDLY_NAME_MAP, getLanguageFriendlyName, normalizeCodeLanguage } from '@lexical/code-prism';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import type { LexicalEditor, NodeKey } from 'lexical';
import {
    $getNearestNodeFromDOMNode,
    $getNodeByKey,
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_LOW,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

import { useEditorAnchor } from '@/components/rich-text-editor/editor-root';
import { useFormatState } from '@/components/rich-text-editor/plugins/toolbar/editor-toolbar';
import { Button } from '@/components/ui/button';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type CodeAction = { key: NodeKey; language: string };

const LANGUAGE_OPTIONS = Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP).sort(([, a], [, b]) => a.localeCompare(b));

function getCodeKeyFromTarget(editor: LexicalEditor, target: EventTarget | null): NodeKey | null {
    if (!(target instanceof Element) || !target.closest('code')) return null;
    if (!editor.getRootElement()?.contains(target)) return null;

    return editor.getEditorState().read(
        () => {
            const node = $getNearestNodeFromDOMNode(target);
            return node ? ($findMatchingParent(node, $isCodeNode)?.getKey() ?? null) : null;
        },
        { editor },
    );
}

function $getCaretCodeKey(): NodeKey | null {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return null;

    return $findMatchingParent(selection.anchor.getNode(), $isCodeNode)?.getKey() ?? null;
}

function CodeActionPlugin() {
    const [editor] = useLexicalComposerContext();
    const anchor = useEditorAnchor();
    const { isEditable } = useFormatState();
    const { isCopied, copyToClipboard } = useCopyToClipboard();
    const [action, setAction] = React.useState<CodeAction | null>(null);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const hoveredKeyRef = React.useRef<NodeKey | null>(null);
    const focusedRef = React.useRef(false);

    const sync = React.useEffectEvent(() => {
        const next = editor.getEditorState().read(
            () => {
                const key = hoveredKeyRef.current ?? (focusedRef.current ? $getCaretCodeKey() : null);
                const node = key === null ? null : $getNodeByKey(key);
                if (!$isCodeNode(node)) return null;

                const language = normalizeCodeLanguage(node.getLanguage() || getDefaultCodeLanguage());
                return { key: node.getKey(), language };
            },
            { editor },
        );

        setAction((prev) => (prev?.key === next?.key && prev?.language === next?.language ? prev : next));
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
            ),
        [editor],
    );

    React.useEffect(() => {
        if (!anchor) return;

        const setHovered = (key: NodeKey | null) => {
            if (hoveredKeyRef.current === key) return;

            hoveredKeyRef.current = key;
            sync();
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (panelRef.current?.contains(event.target as Node)) return;

            setHovered(getCodeKeyFromTarget(editor, event.target));
        };
        const handleMouseLeave = () => setHovered(null);
        const handleFocusIn = () => {
            focusedRef.current = true;
            sync();
        };
        const handleFocusOut = (event: FocusEvent) => {
            focusedRef.current = anchor.contains(event.relatedTarget as Node | null);
            sync();
        };

        anchor.addEventListener('mousemove', handleMouseMove);
        anchor.addEventListener('mouseleave', handleMouseLeave);
        anchor.addEventListener('focusin', handleFocusIn);
        anchor.addEventListener('focusout', handleFocusOut);

        return () => {
            anchor.removeEventListener('mousemove', handleMouseMove);
            anchor.removeEventListener('mouseleave', handleMouseLeave);
            anchor.removeEventListener('focusin', handleFocusIn);
            anchor.removeEventListener('focusout', handleFocusOut);
        };
    }, [editor, anchor]);

    const actionKey = action?.key ?? null;

    React.useLayoutEffect(() => {
        const panel = panelRef.current;
        const reference = actionKey === null ? null : editor.getElementByKey(actionKey);
        if (!panel || !reference) return;

        return autoUpdate(reference, panel, () => {
            computePosition(reference, panel, {
                placement: 'top-end',
                middleware: [offset(({ rects }) => ({ mainAxis: -rects.floating.height - 6, alignmentAxis: 6 }))],
            }).then(({ x, y }) => {
                panel.style.left = `${x}px`;
                panel.style.top = `${y}px`;
            });
        });
    }, [editor, actionKey]);

    if (!anchor || !action) return null;

    const { key, language } = action;
    const isKnownLanguage = Object.hasOwn(CODE_LANGUAGE_FRIENDLY_NAME_MAP, language);

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.currentTarget.value;
        editor.update(() => {
            const node = $getNodeByKey(key);
            if ($isCodeNode(node)) node.setLanguage(value);
        });
        editor.focus();
    };

    const copy = () => {
        const text = editor.getEditorState().read(() => $getNodeByKey(key)?.getTextContent() ?? '', { editor });
        copyToClipboard(text);
    };

    return createPortal(
        <div
            ref={panelRef}
            data-slot='editor-code-actions'
            onMouseDown={(event) => {
                if (!(event.target instanceof HTMLSelectElement)) event.preventDefault();
            }}
            className='absolute top-0 left-0 z-10 flex items-center gap-0.5 rounded-lg bg-background/90 p-0.5 shadow-xs ring-1 ring-foreground/10 backdrop-blur-sm'
        >
            <NativeSelect
                size='sm'
                aria-label='Bahasa kode'
                value={language}
                disabled={!isEditable}
                onChange={handleLanguageChange}
            >
                {!isKnownLanguage && (
                    <NativeSelectOption value={language}>{getLanguageFriendlyName(language)}</NativeSelectOption>
                )}
                {LANGUAGE_OPTIONS.map(([value, label]) => (
                    <NativeSelectOption key={value} value={value}>
                        {label}
                    </NativeSelectOption>
                ))}
            </NativeSelect>
            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            variant='ghost'
                            size='icon-sm'
                            aria-label={isCopied ? 'Tersalin' : 'Salin kode'}
                            onClick={copy}
                        />
                    }
                >
                    {isCopied ? <IconCheck /> : <IconCopy />}
                </TooltipTrigger>
                <TooltipContent>{isCopied ? 'Tersalin' : 'Salin kode'}</TooltipContent>
            </Tooltip>
        </div>,
        anchor,
    );
}

export { CodeActionPlugin };
