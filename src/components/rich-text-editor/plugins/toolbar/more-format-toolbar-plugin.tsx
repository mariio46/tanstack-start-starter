import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    IconClearFormatting,
    IconHighlight,
    IconLetterCase,
    IconLetterCaseLower,
    IconLetterCaseUpper,
    IconSubscript,
    IconSuperscript,
    IconTypography,
} from '@tabler/icons-react';
import type { TextFormatType } from 'lexical';
import { $getSelection, $isRangeSelection, $isTextNode, FORMAT_TEXT_COMMAND } from 'lexical';

import {
    DropdownMenuCheckboxItem,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { EditorToolbarMenu, useFormatState } from './editor-toolbar';

const MORE_FORMAT_ITEMS: { format: TextFormatType; label: string; icon: typeof IconSubscript }[] = [
    { format: 'subscript', label: 'Subskrip', icon: IconSubscript },
    { format: 'superscript', label: 'Superskrip', icon: IconSuperscript },
    { format: 'highlight', label: 'Sorot', icon: IconHighlight },
    { format: 'lowercase', label: 'Huruf kecil', icon: IconLetterCaseLower },
    { format: 'uppercase', label: 'Huruf kapital', icon: IconLetterCaseUpper },
    { format: 'capitalize', label: 'Kapitalisasi', icon: IconLetterCase },
];

function $clearFormatting() {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    selection.setFormat(0);
    selection.setStyle('');
    if (selection.isCollapsed()) return;

    for (const node of selection.extract()) {
        if (!$isTextNode(node)) continue;

        node.setFormat(0);
        node.setStyle('');
    }
}

function MoreFormatToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { formats, isEditable } = useFormatState();

    const isActive = MORE_FORMAT_ITEMS.some(({ format }) => formats[format]);

    return (
        <EditorToolbarMenu
            label='Format lainnya'
            trigger={<IconTypography />}
            disabled={!isEditable}
            triggerClassName={isActive ? 'bg-muted text-foreground' : undefined}
        >
            <DropdownMenuGroup>
                {MORE_FORMAT_ITEMS.map(({ format, label, icon: Icon }) => (
                    <DropdownMenuCheckboxItem
                        key={format}
                        checked={formats[format]}
                        onCheckedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)}
                    >
                        <Icon />
                        {label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.update($clearFormatting)}>
                <IconClearFormatting />
                Hapus format
            </DropdownMenuItem>
        </EditorToolbarMenu>
    );
}

export { $clearFormatting, MoreFormatToolbarPlugin };
