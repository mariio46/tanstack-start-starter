import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IS_APPLE } from '@lexical/utils';
import { IconArrowBackUp, IconArrowForwardUp } from '@tabler/icons-react';
import { REDO_COMMAND, UNDO_COMMAND } from 'lexical';

import { EditorToolbarButton, MOD_KEY, useFormatState } from './editor-toolbar';

function HistoryToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { canUndo, canRedo, isEditable } = useFormatState();

    return (
        <>
            <EditorToolbarButton
                label='Urungkan'
                shortcut={[MOD_KEY, 'Z']}
                disabled={!isEditable || !canUndo}
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
            >
                <IconArrowBackUp />
            </EditorToolbarButton>
            <EditorToolbarButton
                label='Ulangi'
                shortcut={IS_APPLE ? [MOD_KEY, 'Shift', 'Z'] : [MOD_KEY, 'Y']}
                disabled={!isEditable || !canRedo}
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
            >
                <IconArrowForwardUp />
            </EditorToolbarButton>
        </>
    );
}

export { HistoryToolbarPlugin };
