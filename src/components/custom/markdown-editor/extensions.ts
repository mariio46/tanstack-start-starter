import Image from '@tiptap/extension-image';
import Mathematics from '@tiptap/extension-mathematics';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { Youtube } from '@tiptap/extension-youtube';
import { Markdown } from '@tiptap/markdown';
import StarterKit from '@tiptap/starter-kit';

function createMarkdownEditorExtensions(placeholder: string) {
    return [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3, 4],
            },
            link: {
                autolink: true,
                openOnClick: false,
                HTMLAttributes: {
                    class: 'markdown-link',
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            },
            underline: {},
        }),
        Image.configure({
            allowBase64: false,
            inline: false,
            HTMLAttributes: {
                class: 'markdown-image',
                loading: 'lazy',
            },
        }),
        Table.configure({
            resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Youtube.configure({
            controls: true,
            nocookie: true,
            width: 960,
            height: 540,
            HTMLAttributes: {
                class: 'markdown-youtube-frame',
            },
        }),
        Mathematics,
        Placeholder.configure({
            emptyEditorClass: 'is-editor-empty',
            placeholder,
        }),
        Markdown.configure({
            markedOptions: {
                breaks: false,
                gfm: true,
            },
        }),
    ];
}

export { createMarkdownEditorExtensions };
