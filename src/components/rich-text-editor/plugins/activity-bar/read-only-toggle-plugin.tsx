import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { IconLock, IconLockOpen } from '@tabler/icons-react';

import { useEditorConfig } from '@/components/rich-text-editor/editor-root';

import { EditorActivityBarButton } from './editor-activity-bar';

function ReadOnlyTogglePlugin() {
    const [editor] = useLexicalComposerContext();
    const { editable } = useEditorConfig();
    const isEditable = useLexicalEditable();

    if (!editable) return null;

    return (
        <EditorActivityBarButton
            label='Hanya baca'
            pressed={!isEditable}
            onClick={() => editor.setEditable(!isEditable)}
        >
            {isEditable ? <IconLockOpen /> : <IconLock />}
        </EditorActivityBarButton>
    );
}

export { ReadOnlyTogglePlugin };
