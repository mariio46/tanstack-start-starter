import { buildEditorFromExtensions } from '@lexical/extension';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $convertFromMarkdownString, $convertToMarkdownString } from '@lexical/markdown';
import type { LexicalEditor, SerializedEditorState } from 'lexical';
import { $createParagraphNode, $getEditor, $getRoot, $getSelection, $insertNodes, $parseSerializedNode } from 'lexical';

import { parseRichText } from '@/lib/rich-text';

import { RichTextEditorExtension } from '@/components/rich-text-editor/extension';
import { $isEditorEmpty, serializeEditorState } from '@/components/rich-text-editor/serialize';
import { EDITOR_TRANSFORMERS, getSupportedTransformers } from '@/components/rich-text-editor/transformers/markdown';

function $finishImport() {
    const root = $getRoot();

    if (root.isEmpty()) root.append($createParagraphNode());
    if ($getSelection() !== null) root.selectStart();
}

function $exportMarkdown() {
    if ($isEditorEmpty()) return '';

    return $convertToMarkdownString(getSupportedTransformers($getEditor(), EDITOR_TRANSFORMERS));
}

function $exportHtml() {
    if ($isEditorEmpty()) return '';

    return $generateHtmlFromNodes($getEditor(), null);
}

function $importMarkdown(markdown: string) {
    $convertFromMarkdownString(markdown, getSupportedTransformers($getEditor(), EDITOR_TRANSFORMERS));
    $finishImport();
}

function $importHtml(html: string) {
    const dom = new DOMParser().parseFromString(html, 'text/html');
    const nodes = $generateNodesFromDOM($getEditor(), dom);

    $getRoot().clear().select();
    $insertNodes(nodes);
    $finishImport();
}

function $importSerializedState(state: SerializedEditorState) {
    $getRoot()
        .clear()
        .append(...state.root.children.map((child) => $parseSerializedNode(child)));
    $finishImport();
}

function withHeadlessEditor<T>(callback: (editor: LexicalEditor) => T): T {
    const editor = buildEditorFromExtensions(RichTextEditorExtension);

    try {
        return callback(editor);
    } finally {
        editor.dispose();
    }
}

function readRichText<T>(value: string, $read: () => T, empty: T): T {
    if (parseRichText(value) === null) return empty;

    return withHeadlessEditor((editor) => {
        editor.setEditorState(editor.parseEditorState(value));
        return editor.read($read);
    });
}

function writeRichText($write: () => void) {
    return withHeadlessEditor((editor) => {
        editor.update($write, { discrete: true });
        return serializeEditorState(editor.getEditorState());
    });
}

function richTextToHtml(value: string) {
    return readRichText(value, $exportHtml, '');
}

function richTextToMarkdown(value: string) {
    return readRichText(value, $exportMarkdown, '');
}

function markdownToRichText(markdown: string) {
    return writeRichText(() => $importMarkdown(markdown));
}

function htmlToRichText(html: string) {
    return writeRichText(() => $importHtml(html));
}

export {
    $exportHtml,
    $exportMarkdown,
    $importHtml,
    $importMarkdown,
    $importSerializedState,
    htmlToRichText,
    markdownToRichText,
    richTextToHtml,
    richTextToMarkdown,
};
