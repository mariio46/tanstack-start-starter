import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/extension';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    IconCode,
    IconColumns,
    IconMoodSmile,
    IconPhoto,
    IconPlus,
    IconSeparatorHorizontal,
    IconTable,
} from '@tabler/icons-react';

import { $insertCodeBlock } from '@/components/rich-text-editor/extensions/code';
import { useEditorDialog } from '@/components/rich-text-editor/plugins/dialogs/dialog-host';
import { InsertColumnsDialog } from '@/components/rich-text-editor/plugins/dialogs/insert-columns-dialog';
import { InsertEmojiDialog } from '@/components/rich-text-editor/plugins/dialogs/insert-emoji-dialog';
import { InsertImageDialog } from '@/components/rich-text-editor/plugins/dialogs/insert-image-dialog';
import { InsertTableDialog } from '@/components/rich-text-editor/plugins/dialogs/insert-table-dialog';
import { DropdownMenuGroup, DropdownMenuItem } from '@/components/ui/dropdown-menu';

import { EditorToolbarMenu, useFormatState } from './editor-toolbar';

function InsertToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const dialog = useEditorDialog();
    const { blockType, isEditable, isInTable } = useFormatState();

    return (
        <EditorToolbarMenu
            label='Sisipkan'
            trigger={
                <>
                    <IconPlus />
                    Sisipkan
                </>
            }
            disabled={!isEditable}
            align='end'
        >
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}>
                    <IconSeparatorHorizontal />
                    Garis pemisah
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.update($insertCodeBlock)}>
                    <IconCode />
                    Code block
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={isInTable}
                    onClick={() => dialog.open((close) => <InsertTableDialog close={close} />)}
                >
                    <IconTable />
                    Tabel
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={blockType === 'code'}
                    onClick={() => dialog.open((close) => <InsertImageDialog close={close} />)}
                >
                    <IconPhoto />
                    Gambar
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={blockType === 'code' || isInTable}
                    onClick={() => dialog.open((close) => <InsertColumnsDialog close={close} />)}
                >
                    <IconColumns />
                    Kolom
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => dialog.open((close) => <InsertEmojiDialog close={close} />)}>
                    <IconMoodSmile />
                    Emoji
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </EditorToolbarMenu>
    );
}

export { InsertToolbarPlugin };
