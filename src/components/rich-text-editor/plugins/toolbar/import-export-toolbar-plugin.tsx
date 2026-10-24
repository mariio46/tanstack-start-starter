import { exportFile } from '@lexical/file';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IconFileExport, IconFileImport, IconFileTypeHtml, IconJson, IconMarkdown } from '@tabler/icons-react';
import type { LexicalEditor, SerializedEditorState } from 'lexical';

import { downloadFile } from '@/lib/file';

import {
    DOCUMENT_EXPORT_FILE_NAME,
    DOCUMENT_IMPORT_ACCEPT,
    DOCUMENT_IMPORT_FORMATS,
} from '@/components/rich-text-editor/constants';
import {
    $exportHtml,
    $exportMarkdown,
    $importHtml,
    $importMarkdown,
    $importSerializedState,
} from '@/components/rich-text-editor/convert';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { EditorToolbarMenu, useFormatState } from './editor-toolbar';

function openFilePicker(accept: string, onPick: (file: File) => void) {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = accept;
    input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (file) onPick(file);
    });
    input.click();
}

function parseSerializedState(editor: LexicalEditor, text: string): SerializedEditorState | null {
    try {
        const parsed = JSON.parse(text);
        const state: SerializedEditorState = parsed?.editorState ?? parsed;

        editor.parseEditorState(state);

        return state;
    } catch {
        return null;
    }
}

async function importDocument(editor: LexicalEditor, file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    const format = DOCUMENT_IMPORT_FORMATS[extension];
    if (!format) return;

    const text = await file.text();

    if (format === 'json') {
        const state = parseSerializedState(editor, text);
        if (!state) return;

        editor.update(() => $importSerializedState(state));
    } else if (format === 'markdown') {
        editor.update(() => $importMarkdown(text));
    } else {
        editor.update(() => $importHtml(text));
    }

    editor.focus();
}

function ImportExportToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { isEditable } = useFormatState();

    const handleImport = () => openFilePicker(DOCUMENT_IMPORT_ACCEPT, (file) => importDocument(editor, file));

    return (
        <EditorToolbarMenu label='Import & export' trigger={<IconFileExport />} align='end'>
            <DropdownMenuGroup>
                <DropdownMenuItem disabled={!isEditable} onClick={handleImport}>
                    <IconFileImport />
                    Import file…
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuLabel>Export sebagai</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() =>
                        exportFile(editor, { fileName: DOCUMENT_EXPORT_FILE_NAME, source: 'rich-text-editor' })
                    }
                >
                    <IconJson />
                    Lexical JSON
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        downloadFile(editor.read($exportMarkdown), `${DOCUMENT_EXPORT_FILE_NAME}.md`, 'text/markdown')
                    }
                >
                    <IconMarkdown />
                    Markdown
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        downloadFile(editor.read($exportHtml), `${DOCUMENT_EXPORT_FILE_NAME}.html`, 'text/html')
                    }
                >
                    <IconFileTypeHtml />
                    HTML
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </EditorToolbarMenu>
    );
}

export { ImportExportToolbarPlugin };
