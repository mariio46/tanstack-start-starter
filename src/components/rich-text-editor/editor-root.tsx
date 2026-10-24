import * as React from 'react';
import { createPortal } from 'react-dom';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer';
import type { AnyLexicalExtensionArgument } from 'lexical';

import { cn } from '@/lib/utils';

import { EditorDialogProvider } from '@/components/rich-text-editor/plugins/dialogs/dialog-host';
import { TooltipProvider } from '@/components/ui/tooltip';

type MentionItem = {
    id: string;
    name: string;
    avatar?: string;
    description?: string;
};

type EditorMentions = {
    search: (query: string) => Promise<MentionItem[]>;
};

type EditorConfig = {
    editable: boolean;
    disabled: boolean;
    invalid: boolean;
    uploadImage?: (file: File) => Promise<string>;
    mentions?: EditorMentions;
    maxLength?: number;
};

type EditorAnchor = {
    anchor: HTMLElement | null;
    setAnchor: (element: HTMLElement | null) => void;
};

type EditorExpand = {
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
};

const EditorConfigContext = React.createContext<EditorConfig | null>(null);
const EditorAnchorContext = React.createContext<EditorAnchor | null>(null);
const EditorExpandContext = React.createContext<EditorExpand | null>(null);

function useEditorConfig() {
    const context = React.useContext(EditorConfigContext);
    if (!context) throw new Error('useEditorConfig must be used within an EditorRoot');

    return context;
}

function useEditorAnchorContext() {
    const context = React.useContext(EditorAnchorContext);
    if (!context) throw new Error('useEditorAnchor must be used within an EditorRoot');

    return context;
}

function useEditorAnchor() {
    return useEditorAnchorContext().anchor;
}

function useEditorExpand() {
    const context = React.useContext(EditorExpandContext);
    if (!context) throw new Error('useEditorExpand must be used within an EditorRoot');

    return context;
}

function EditableSync({ editable }: { editable: boolean }) {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        editor.setEditable(editable);
    }, [editor, editable]);

    return null;
}

function createEditorHost() {
    const host = document.createElement('div');
    host.dataset.slot = 'rich-text-editor-host';
    host.style.display = 'contents';

    return host;
}

function EditorHostSlot({ host, expanded }: { host: HTMLElement; expanded: boolean }) {
    const slotRef = React.useRef<HTMLDivElement>(null);

    React.useLayoutEffect(() => {
        if (!expanded) {
            slotRef.current?.appendChild(host);
            return;
        }

        document.body.appendChild(host);

        const { style } = document.documentElement;
        const overflow = style.overflow;
        style.overflow = 'hidden';

        const inerted = Array.from(document.body.children).filter(
            (element): element is HTMLElement => element !== host && element instanceof HTMLElement && !element.inert,
        );
        for (const element of inerted) element.inert = true;

        return () => {
            style.overflow = overflow;
            for (const element of inerted) element.inert = false;
        };
    }, [host, expanded]);

    React.useLayoutEffect(() => () => host.remove(), [host]);

    return <div ref={slotRef} data-slot='rich-text-editor-slot' className='contents' />;
}

function ExpandFocusSync({ expanded, focusRef }: { expanded: boolean; focusRef: React.RefObject<HTMLElement | null> }) {
    const [editor] = useLexicalComposerContext();
    const expandedRef = React.useRef(expanded);

    React.useLayoutEffect(() => {
        if (expandedRef.current === expanded) return;
        expandedRef.current = expanded;

        const previous = focusRef.current;
        focusRef.current = null;

        const fromEditor = !previous || Boolean(editor.getRootElement()?.contains(previous));
        if (editor.isEditable() && (expanded || fromEditor)) editor.focus();
        else previous?.focus({ preventScroll: true });
    }, [editor, expanded]);

    return null;
}

interface EditorRootProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
    extension: AnyLexicalExtensionArgument;
    editable?: boolean;
    disabled?: boolean;
    invalid?: boolean;
    uploadImage?: (file: File) => Promise<string>;
    mentions?: EditorMentions;
    maxLength?: number;
}

function EditorRoot({
    extension,
    editable = true,
    disabled = false,
    invalid = false,
    uploadImage,
    mentions,
    maxLength,
    className,
    children,
    ...props
}: EditorRootProps) {
    const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
    const [host] = React.useState(createEditorHost);
    const [expanded, setExpandedState] = React.useState(false);
    const [placeholderHeight, setPlaceholderHeight] = React.useState(0);
    const shellRef = React.useRef<HTMLDivElement>(null);
    const focusRef = React.useRef<HTMLElement | null>(null);

    const isEditable = !disabled && editable;

    const config: EditorConfig = { editable: isEditable, disabled, invalid, uploadImage, mentions, maxLength };

    const setExpanded = (next: boolean) => {
        if (next === expanded || (next && disabled)) return;

        const shell = shellRef.current;
        const active = document.activeElement;
        focusRef.current = shell && active instanceof HTMLElement && shell.contains(active) ? active : null;

        if (next) setPlaceholderHeight(shell?.offsetHeight ?? 0);
        setExpandedState(next);
    };

    React.useEffect(() => {
        const shell = shellRef.current;
        if (!expanded || !shell) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing) return;

            event.preventDefault();
            setExpanded(false);
        };

        shell.addEventListener('keydown', handleKeyDown);
        return () => shell.removeEventListener('keydown', handleKeyDown);
    }, [expanded]);

    return (
        <EditorConfigContext.Provider value={config}>
            <EditorAnchorContext.Provider value={{ anchor, setAnchor }}>
                <EditorExpandContext.Provider value={{ expanded, setExpanded }}>
                    {expanded && (
                        <div
                            aria-hidden
                            data-slot='rich-text-editor-placeholder'
                            style={{ height: placeholderHeight }}
                        />
                    )}
                    <EditorHostSlot host={host} expanded={expanded} />
                    {createPortal(
                        <>
                            {expanded && (
                                <div
                                    aria-hidden
                                    data-slot='rich-text-editor-backdrop'
                                    className='fade-in-0 fixed inset-0 z-40 animate-in bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs'
                                    onClick={() => setExpanded(false)}
                                />
                            )}
                            <div
                                ref={shellRef}
                                data-slot='rich-text-editor'
                                data-disabled={disabled || undefined}
                                data-invalid={invalid || undefined}
                                data-readonly={(!disabled && !editable) || undefined}
                                data-expanded={expanded || undefined}
                                className={cn(
                                    'flex min-w-0 flex-col rounded-lg border border-input bg-background transition-[color,box-shadow] dark:bg-input/30',
                                    'focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
                                    'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
                                    'data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40',
                                    'data-expanded:fade-in-0 data-expanded:zoom-in-95 data-expanded:fixed data-expanded:inset-4 data-expanded:z-40 data-expanded:mx-auto data-expanded:h-auto data-expanded:max-h-none data-expanded:max-w-5xl data-expanded:animate-in data-expanded:bg-background data-expanded:shadow-2xl data-expanded:duration-100 sm:data-expanded:inset-8 dark:data-expanded:bg-background',
                                    className,
                                )}
                                {...props}
                            >
                                <LexicalExtensionComposer extension={extension} contentEditable={null}>
                                    <TooltipProvider>
                                        <EditorDialogProvider>
                                            <EditableSync editable={isEditable} />
                                            <ExpandFocusSync expanded={expanded} focusRef={focusRef} />
                                            {children}
                                        </EditorDialogProvider>
                                    </TooltipProvider>
                                </LexicalExtensionComposer>
                            </div>
                        </>,
                        host,
                    )}
                </EditorExpandContext.Provider>
            </EditorAnchorContext.Provider>
        </EditorConfigContext.Provider>
    );
}

export type { EditorConfig, EditorExpand, EditorMentions, EditorRootProps, MentionItem };
export { EditorRoot, useEditorAnchor, useEditorAnchorContext, useEditorConfig, useEditorExpand };
