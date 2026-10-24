import { IconArrowsDiagonal, IconArrowsDiagonalMinimize2 } from '@tabler/icons-react';

import { useEditorConfig, useEditorExpand } from '@/components/rich-text-editor/editor-root';

import { EditorToolbarButton } from './editor-toolbar';

function ExpandToolbarPlugin() {
    const { disabled } = useEditorConfig();
    const { expanded, setExpanded } = useEditorExpand();

    return (
        <EditorToolbarButton
            label='Tampilan penuh'
            pressed={expanded}
            disabled={disabled}
            onClick={() => setExpanded(!expanded)}
        >
            {expanded ? <IconArrowsDiagonalMinimize2 /> : <IconArrowsDiagonal />}
        </EditorToolbarButton>
    );
}

export { ExpandToolbarPlugin };
