import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IconBold, IconCode, IconItalic, IconStrikethrough, IconUnderline } from '@tabler/icons-react';
import type { TextFormatType } from 'lexical';
import { FORMAT_TEXT_COMMAND } from 'lexical';

import { EditorToolbarButton, MOD_KEY, useFormatState } from './editor-toolbar';

const TEXT_FORMAT_ITEMS: {
    format: TextFormatType;
    label: string;
    icon: typeof IconBold;
    shortcut?: string[];
}[] = [
    { format: 'bold', label: 'Tebal', icon: IconBold, shortcut: [MOD_KEY, 'B'] },
    { format: 'italic', label: 'Miring', icon: IconItalic, shortcut: [MOD_KEY, 'I'] },
    { format: 'underline', label: 'Garis bawah', icon: IconUnderline, shortcut: [MOD_KEY, 'U'] },
    { format: 'strikethrough', label: 'Coret', icon: IconStrikethrough },
    { format: 'code', label: 'Inline code', icon: IconCode },
];

function TextFormatToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { formats, isEditable } = useFormatState();

    return TEXT_FORMAT_ITEMS.map(({ format, label, icon: Icon, shortcut }) => (
        <EditorToolbarButton
            key={format}
            label={label}
            shortcut={shortcut}
            pressed={formats[format]}
            disabled={!isEditable}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)}
        >
            <Icon />
        </EditorToolbarButton>
    ));
}

export { TextFormatToolbarPlugin };
