import 'katex/dist/katex.min.css';

import * as React from 'react';

import { EditorContent, useEditor } from '@tiptap/react';

import { cn } from '@/lib/utils';

import { createMarkdownEditorExtensions } from './extensions';
import { normalizeMarkdownValue, serializeEditorMarkdown } from './markdown-adapters';
import { MarkdownEditorToolbar } from './toolbar';

type MarkdownEditorProps = {
    ariaLabel?: string;
    className?: string;
    disabled?: boolean;
    invalid?: boolean;
    minHeight?: string;
    onBlur?: VoidFunction;
    onChange: (markdown: string) => void;
    placeholder?: string;
    value: string;
};

function MarkdownEditor({
    ariaLabel = 'Editor markdown',
    className,
    disabled = false,
    invalid = false,
    minHeight = '24rem',
    onBlur,
    onChange,
    placeholder = 'Mulai tulis konten markdown Anda...',
    value,
}: MarkdownEditorProps) {
    const normalizedValue = normalizeMarkdownValue(value);
    const lastValueRef = React.useRef(normalizedValue);
    const [extensions] = React.useState(() => createMarkdownEditorExtensions(placeholder));

    const editor = useEditor({
        immediatelyRender: false,
        editable: !disabled,
        extensions,
        content: normalizedValue,
        contentType: 'markdown',
        editorProps: {
            attributes: {
                'aria-label': ariaLabel,
                class: 'markdown-editor__content prose prose-sm prose-neutral max-w-none max-h-112 overflow-auto focus:outline-none dark:prose-invert',
            },
        },
        onCreate: ({ editor: currentEditor }) => {
            lastValueRef.current = serializeEditorMarkdown(currentEditor.getMarkdown());
        },
        onBlur: () => {
            onBlur?.();
        },
        onUpdate: ({ editor: currentEditor }) => {
            const nextValue = serializeEditorMarkdown(currentEditor.getMarkdown());

            lastValueRef.current = nextValue;
            onChange(nextValue);
        },
    });

    React.useEffect(() => {
        if (!editor) {
            return;
        }

        editor.setEditable(!disabled);
    }, [disabled, editor]);

    React.useEffect(() => {
        if (!editor) {
            return;
        }

        const currentValue = serializeEditorMarkdown(editor.getMarkdown());

        if (currentValue === normalizedValue || lastValueRef.current === normalizedValue) {
            lastValueRef.current = normalizedValue;
            return;
        }

        editor.commands.setContent(normalizedValue, {
            contentType: 'markdown',
            emitUpdate: false,
        });
        lastValueRef.current = normalizedValue;
    }, [editor, normalizedValue]);

    return (
        <div
            className={cn('markdown-editor w-full', className)}
            aria-invalid={invalid}
            data-disabled={disabled}
            style={{ ['--markdown-editor-min-height' as string]: minHeight }}
        >
            <MarkdownEditorToolbar editor={editor} disabled={disabled} />
            <div className='markdown-editor__viewport'>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

export type { MarkdownEditorProps };
export { MarkdownEditor };
