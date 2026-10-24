import * as React from 'react';
import { createPortal } from 'react-dom';

import type { ReferenceElement } from '@floating-ui/dom';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { $isLinkNode, formatUrl } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { SelectionAlwaysOnDisplay } from '@lexical/react/LexicalSelectionAlwaysOnDisplay';
import { mergeRegister } from '@lexical/utils';
import { IconExternalLink, IconPencil, IconUnlink } from '@tabler/icons-react';
import type { LexicalEditor, NodeKey } from 'lexical';
import {
    $getNodeByKey,
    BLUR_COMMAND,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_LOW,
    KEY_ESCAPE_COMMAND,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';

import { useEditorAnchor } from '@/components/rich-text-editor/editor-root';
import {
    $getSelectedLinkNode,
    $insertLink,
    $removeLink,
    $setLinkUrl,
    isValidLinkUrl,
    OPEN_LINK_EDITOR_COMMAND,
} from '@/components/rich-text-editor/extensions/link';
import { useFormatState } from '@/components/rich-text-editor/plugins/toolbar/editor-toolbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type LinkEditorState =
    | { mode: 'closed' }
    | { mode: 'view'; key: NodeKey; url: string; href: string }
    | { mode: 'edit'; key: NodeKey | null; url: string };

type SelectedLink = { key: NodeKey; url: string; href: string };

const CLOSED: LinkEditorState = { mode: 'closed' };

function readSelectedLink(editor: LexicalEditor): SelectedLink | null {
    return editor.getEditorState().read(
        () => {
            const link = $getSelectedLinkNode();
            if (!link) return null;

            return { key: link.getKey(), url: link.getURL(), href: link.sanitizeUrl(link.getURL()) };
        },
        { editor },
    );
}

function getSelectionReference(editor: LexicalEditor): ReferenceElement | null {
    const root = editor.getRootElement();
    const selection = window.getSelection();
    if (!root || !selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0).cloneRange();
    if (!root.contains(range.commonAncestorContainer)) return null;

    return {
        contextElement: root,
        getBoundingClientRect: () => {
            const rect = range.getBoundingClientRect();
            if (rect.width > 0 || rect.height > 0) return rect;

            const container = range.startContainer;
            const element = container instanceof Element ? container : container.parentElement;
            return (element ?? root).getBoundingClientRect();
        },
    };
}

function LinkEditorButton({ label, ...props }: { label: string } & React.ComponentProps<typeof Button>) {
    return (
        <Tooltip>
            <TooltipTrigger render={<Button variant='ghost' size='icon-sm' aria-label={label} {...props} />} />
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}

function LinkEditorPlugin() {
    const [editor] = useLexicalComposerContext();
    const anchor = useEditorAnchor();
    const { isEditable } = useFormatState();
    const [state, setState] = React.useState<LinkEditorState>(CLOSED);
    const [invalid, setInvalid] = React.useState(false);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const createReferenceRef = React.useRef<ReferenceElement | null>(null);

    const isFocusWithin = () => {
        const active = document.activeElement;
        return Boolean(editor.getRootElement()?.contains(active) || panelRef.current?.contains(active));
    };

    React.useEffect(() => {
        const sync = () => {
            const link = readSelectedLink(editor);
            const visible = link !== null && editor.isEditable() && isFocusWithin();

            setState((prev) => {
                if (prev.mode === 'edit') return prev;
                if (!visible) return prev.mode === 'closed' ? prev : CLOSED;
                if (prev.mode === 'view' && prev.key === link.key && prev.href === link.href) return prev;

                return { mode: 'view', ...link };
            });
        };

        return mergeRegister(
            editor.registerUpdateListener(sync),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    sync();
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                BLUR_COMMAND,
                (event) => {
                    if (panelRef.current?.contains(event.relatedTarget as Node | null)) return false;

                    setState((prev) => (prev.mode === 'view' ? CLOSED : prev));
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_ESCAPE_COMMAND,
                (event) => {
                    if (!panelRef.current) return false;

                    event.preventDefault();
                    setState((prev) => (prev.mode === 'view' ? CLOSED : prev));
                    return true;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                OPEN_LINK_EDITOR_COMMAND,
                () => {
                    if (!editor.isEditable()) return false;

                    const link = readSelectedLink(editor);
                    createReferenceRef.current = link
                        ? null
                        : (getSelectionReference(editor) ?? editor.getRootElement());
                    setInvalid(false);
                    setState({ mode: 'edit', key: link?.key ?? null, url: link?.url ?? '' });
                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),
        );
    }, [editor]);

    React.useEffect(() => {
        if (!isEditable) setState(CLOSED);
    }, [isEditable]);

    const referenceKey = state.mode === 'closed' ? null : state.key;

    React.useLayoutEffect(() => {
        const panel = panelRef.current;
        if (!panel || state.mode === 'closed') return;

        const reference: ReferenceElement | null =
            referenceKey === null ? createReferenceRef.current : editor.getElementByKey(referenceKey);
        if (!reference) return;

        return autoUpdate(reference, panel, () => {
            computePosition(reference, panel, {
                placement: 'bottom-start',
                middleware: [offset(6), flip(), shift({ padding: 8 })],
            }).then(({ x, y }) => {
                panel.style.left = `${x}px`;
                panel.style.top = `${y}px`;
            });
        });
    }, [editor, state.mode, referenceKey]);

    const close = () => {
        setState(CLOSED);
        editor.focus();
    };

    const startEdit = () => {
        if (state.mode !== 'view') return;

        setInvalid(false);
        setState({ mode: 'edit', key: state.key, url: state.url });
    };

    const remove = () => {
        if (state.mode !== 'view') return;

        const { key } = state;
        editor.update(() => {
            const node = $getNodeByKey(key);
            if ($isLinkNode(node)) $removeLink(node);
        });
        close();
    };

    const save = () => {
        if (state.mode !== 'edit') return;

        const { key } = state;
        const value = state.url.trim();

        if (value === '') {
            if (key !== null) {
                editor.update(() => {
                    const node = $getNodeByKey(key);
                    if ($isLinkNode(node)) $removeLink(node);
                });
            }
            close();
            return;
        }

        const url = formatUrl(value);
        if (!isValidLinkUrl(url)) {
            setInvalid(true);
            return;
        }

        editor.update(() => {
            if (key === null) {
                $insertLink(url);
                return;
            }

            const node = $getNodeByKey(key);
            if ($isLinkNode(node)) $setLinkUrl(node, url);
        });
        close();
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            save();
        } else if (event.key === 'Escape') {
            event.preventDefault();
            close();
        }
    };

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (panelRef.current?.contains(event.relatedTarget as Node | null)) return;

        setState(CLOSED);
    };

    if (!anchor || state.mode === 'closed') return null;

    return createPortal(
        <>
            {state.mode === 'edit' && <SelectionAlwaysOnDisplay />}
            <div
                ref={panelRef}
                data-slot='editor-link-editor'
                role='dialog'
                aria-label={state.mode === 'edit' ? 'Ubah link' : 'Link'}
                onMouseDown={(event) => {
                    if (!(event.target instanceof HTMLInputElement)) event.preventDefault();
                }}
                className='absolute top-0 left-0 z-50 flex max-w-[calc(100%-1rem)] flex-col gap-1 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10'
            >
                {state.mode === 'view' ? (
                    <div className='flex items-center gap-0.5'>
                        <a
                            href={state.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            title={state.url}
                            className='min-w-0 max-w-64 truncate px-2 font-medium text-primary text-sm underline-offset-4 hover:underline'
                        >
                            {state.url}
                        </a>
                        <Separator orientation='vertical' className='mx-0.5 h-5' />
                        <LinkEditorButton
                            label='Buka di tab baru'
                            render={<a href={state.href} target='_blank' rel='noopener noreferrer' />}
                        >
                            <IconExternalLink />
                        </LinkEditorButton>
                        <LinkEditorButton label='Ubah link' onClick={startEdit}>
                            <IconPencil />
                        </LinkEditorButton>
                        <LinkEditorButton label='Hapus link' onClick={remove}>
                            <IconUnlink />
                        </LinkEditorButton>
                    </div>
                ) : (
                    <>
                        <div className='flex items-center gap-1'>
                            <Input
                                autoFocus
                                aria-label='URL'
                                placeholder='https://example.com'
                                value={state.url}
                                aria-invalid={invalid || undefined}
                                onChange={(event) => {
                                    const url = event.currentTarget.value;
                                    setInvalid(false);
                                    setState((prev) => (prev.mode === 'edit' ? { ...prev, url } : prev));
                                }}
                                onKeyDown={handleInputKeyDown}
                                onBlur={handleInputBlur}
                                className='h-7 w-64'
                            />
                            <Button size='sm' onClick={save}>
                                Simpan
                            </Button>
                            <Button size='sm' variant='ghost' onClick={close}>
                                Batal
                            </Button>
                        </div>
                        {invalid && (
                            <p role='alert' className='px-1 pb-0.5 text-destructive text-xs'>
                                Masukkan URL atau alamat email yang valid.
                            </p>
                        )}
                    </>
                )}
            </div>
        </>,
        anchor,
    );
}

export { LinkEditorPlugin };
