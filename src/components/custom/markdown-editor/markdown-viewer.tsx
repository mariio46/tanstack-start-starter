import 'katex/dist/katex.min.css';

import * as React from 'react';

import { EditorContent, useEditor } from '@tiptap/react';

import { createMarkdownEditorExtensions } from './extensions';
import { normalizeMarkdownValue } from './markdown-adapters';

type MarkdownViewerProps = {
    className?: string;
    value: string;
};

function MarkdownViewer({ className, value }: MarkdownViewerProps) {
    const normalizedValue = normalizeMarkdownValue(value);
    const [extensions] = React.useState(() => createMarkdownEditorExtensions(''));

    const editor = useEditor({
        immediatelyRender: false,
        editable: false,
        extensions,
        content: normalizedValue,
        contentType: 'markdown',
        editorProps: {
            attributes: {
                class: 'markdown-viewer__content prose prose-sm prose-neutral max-w-none dark:prose-invert',
            },
        },
    });

    React.useEffect(() => {
        if (!editor) {
            return;
        }

        editor.commands.setContent(normalizedValue, {
            contentType: 'markdown',
            emitUpdate: false,
        });
    }, [editor, normalizedValue]);

    return <EditorContent editor={editor} className={className} />;
}

export { MarkdownViewer };
