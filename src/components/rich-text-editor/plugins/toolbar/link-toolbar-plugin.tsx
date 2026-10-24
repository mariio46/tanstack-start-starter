import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IconLink } from '@tabler/icons-react';

import { $unlinkSelection, OPEN_LINK_EDITOR_COMMAND } from '@/components/rich-text-editor/extensions/link';

import { EditorToolbarButton, MOD_KEY, useFormatState } from './editor-toolbar';

function LinkToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { isLink, isEditable } = useFormatState();

    const handleClick = () => {
        if (isLink) {
            editor.update($unlinkSelection);
            editor.focus();
            return;
        }

        editor.dispatchCommand(OPEN_LINK_EDITOR_COMMAND, undefined);
    };

    return (
        <EditorToolbarButton
            label='Link'
            shortcut={[MOD_KEY, 'K']}
            pressed={isLink}
            disabled={!isEditable}
            onClick={handleClick}
        >
            <IconLink />
        </EditorToolbarButton>
    );
}

export { LinkToolbarPlugin };
