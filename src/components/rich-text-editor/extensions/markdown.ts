import { registerMarkdownShortcuts } from '@lexical/markdown';
import { defineExtension } from 'lexical';

import { EDITOR_TRANSFORMERS, getSupportedTransformers } from '@/components/rich-text-editor/transformers/markdown';

const MarkdownShortcutsExtension = defineExtension({
    name: '@rich-text-editor/markdown-shortcuts',
    register: (editor) => registerMarkdownShortcuts(editor, getSupportedTransformers(editor, EDITOR_TRANSFORMERS)),
});

export { MarkdownShortcutsExtension };
