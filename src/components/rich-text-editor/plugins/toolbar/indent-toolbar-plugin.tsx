import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IconIndentDecrease, IconIndentIncrease } from '@tabler/icons-react';
import { INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND } from 'lexical';

import { EditorToolbarButton, useFormatState } from './editor-toolbar';

function IndentToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { isEditable } = useFormatState();

    return (
        <>
            <EditorToolbarButton
                label='Kurangi indentasi'
                shortcut={['Shift', 'Tab']}
                disabled={!isEditable}
                onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
            >
                <IconIndentDecrease />
            </EditorToolbarButton>
            <EditorToolbarButton
                label='Tambah indentasi'
                shortcut={['Tab']}
                disabled={!isEditable}
                onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
            >
                <IconIndentIncrease />
            </EditorToolbarButton>
        </>
    );
}

export { IndentToolbarPlugin };
