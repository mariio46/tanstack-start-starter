import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { HeadingTagType } from '@lexical/rich-text';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import type { LexicalEditor } from 'lexical';
import { $createParagraphNode, $getSelection } from 'lexical';

import { BLOCK_TYPES } from '@/components/rich-text-editor/constants';
import { $setCodeBlock } from '@/components/rich-text-editor/extensions/code';
import type { BlockType } from '@/components/rich-text-editor/extensions/format-state';
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';

import { EditorToolbarMenu, useFormatState } from './editor-toolbar';

const HEADING_TAGS: BlockType[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

function isHeadingTag(value: BlockType): value is HeadingTagType {
    return HEADING_TAGS.includes(value);
}

function formatBlock(editor: LexicalEditor, value: BlockType) {
    if (value === 'bullet') return editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    if (value === 'number') return editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    if (value === 'check') return editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);

    editor.update(() => {
        const selection = $getSelection();

        if (value === 'code') return $setCodeBlock();
        if (value === 'quote') return $setBlocksType(selection, () => $createQuoteNode());
        if (isHeadingTag(value)) return $setBlocksType(selection, () => $createHeadingNode(value));

        $setBlocksType(selection, () => $createParagraphNode());
    });
}

function BlockFormatToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { blockType, isEditable } = useFormatState();

    const active = BLOCK_TYPES.find(({ value }) => value === blockType) ?? BLOCK_TYPES[0];
    const ActiveIcon = active.icon;

    const handleValueChange = (value: BlockType) => formatBlock(editor, value);

    return (
        <EditorToolbarMenu
            label='Format blok'
            trigger={
                <>
                    <ActiveIcon />
                    <span className='w-24 truncate text-start'>{active.label}</span>
                </>
            }
            disabled={!isEditable}
        >
            <DropdownMenuRadioGroup value={blockType} onValueChange={handleValueChange}>
                {BLOCK_TYPES.map(({ value, label, icon: Icon }) => (
                    <DropdownMenuRadioItem key={value} value={value}>
                        <Icon />
                        {label}
                    </DropdownMenuRadioItem>
                ))}
            </DropdownMenuRadioGroup>
        </EditorToolbarMenu>
    );
}

export { BlockFormatToolbarPlugin, formatBlock };
