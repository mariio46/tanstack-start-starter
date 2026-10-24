import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/extension';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IconSeparatorHorizontal } from '@tabler/icons-react';
import { FORMAT_ELEMENT_COMMAND } from 'lexical';

import { BLOCK_TYPES } from '@/components/rich-text-editor/constants';
import type { BlockType } from '@/components/rich-text-editor/extensions/format-state';
import { formatBlock } from '@/components/rich-text-editor/plugins/toolbar/block-format-toolbar-plugin';
import { ALIGNMENT_ITEMS } from '@/components/rich-text-editor/plugins/toolbar/element-format-toolbar-plugin';

import type { SlashMenuItem } from './editor-slash-menu';
import { useSlashMenuItems } from './editor-slash-menu';

const BLOCK_ITEMS: { value: BlockType; description: string; keywords: string[] }[] = [
    { value: 'paragraph', description: 'Teks biasa', keywords: ['text', 'normal', 'p', 'teks'] },
    { value: 'h1', description: 'Judul bagian besar', keywords: ['h1', 'title', 'heading', 'judul'] },
    { value: 'h2', description: 'Judul bagian sedang', keywords: ['h2', 'subtitle', 'heading', 'judul'] },
    { value: 'h3', description: 'Judul bagian kecil', keywords: ['h3', 'heading', 'judul'] },
    { value: 'number', description: 'Daftar dengan nomor', keywords: ['ol', 'ordered', 'numbered'] },
    { value: 'bullet', description: 'Daftar berpoin sederhana', keywords: ['ul', 'unordered', 'bullet'] },
    { value: 'check', description: 'Lacak tugas dengan checkbox', keywords: ['todo', 'task', 'checkbox', 'tugas'] },
    { value: 'quote', description: 'Tulis kutipan', keywords: ['blockquote', 'citation'] },
];

const ALIGNMENT_DESCRIPTIONS: Record<string, string> = {
    left: 'Ratakan teks ke kiri',
    center: 'Ratakan teks ke tengah',
    right: 'Ratakan teks ke kanan',
    justify: 'Ratakan teks ke kedua sisi',
};

function BasicSlashItems() {
    const [editor] = useLexicalComposerContext();

    const blockItems: SlashMenuItem[] = BLOCK_ITEMS.flatMap(({ value, description, keywords }) => {
        const block = BLOCK_TYPES.find((type) => type.value === value);
        if (!block) return [];

        return {
            value,
            label: block.label,
            icon: block.icon,
            description,
            group: 'Blok dasar',
            keywords,
            onSelect: () => formatBlock(editor, value),
        };
    });

    const items: SlashMenuItem[] = [
        ...blockItems,
        {
            value: 'divider',
            label: 'Garis pemisah',
            icon: IconSeparatorHorizontal,
            description: 'Pisahkan blok secara visual',
            group: 'Blok dasar',
            keywords: ['hr', 'horizontal rule', 'separator', 'line'],
            onSelect: () => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
        },
        ...ALIGNMENT_ITEMS.map(({ format, label, icon }) => ({
            value: `align-${format}`,
            label,
            icon,
            description: ALIGNMENT_DESCRIPTIONS[format],
            group: 'Perataan',
            keywords: ['align', 'alignment', format],
            onSelect: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format),
        })),
    ];

    useSlashMenuItems(items);

    return null;
}

export { BasicSlashItems };
