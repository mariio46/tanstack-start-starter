import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    IconAlignCenter,
    IconAlignJustified,
    IconAlignLeft,
    IconAlignRight,
    IconTextDirectionLtr,
    IconTextDirectionRtl,
} from '@tabler/icons-react';
import type { ElementFormatType } from 'lexical';
import { FORMAT_ELEMENT_COMMAND } from 'lexical';

import { DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { EditorToolbarMenu, useFormatState } from './editor-toolbar';

type AlignmentItem = { format: Exclude<ElementFormatType, ''>; label: string; icon: typeof IconAlignLeft };

const ALIGNMENT_ITEMS: AlignmentItem[] = [
    { format: 'left', label: 'Rata kiri', icon: IconAlignLeft },
    { format: 'center', label: 'Rata tengah', icon: IconAlignCenter },
    { format: 'right', label: 'Rata kanan', icon: IconAlignRight },
    { format: 'justify', label: 'Rata kiri-kanan', icon: IconAlignJustified },
];

const DIRECTION_ITEMS: AlignmentItem[] = [
    { format: 'start', label: 'Rata awal', icon: IconTextDirectionLtr },
    { format: 'end', label: 'Rata akhir', icon: IconTextDirectionRtl },
];

function ElementFormatToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { elementFormat, isEditable } = useFormatState();

    const active =
        [...ALIGNMENT_ITEMS, ...DIRECTION_ITEMS].find(({ format }) => format === elementFormat) ?? ALIGNMENT_ITEMS[0];
    const ActiveIcon = active.icon;

    const handleValueChange = (value: AlignmentItem['format']) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value);
    };

    const renderItem = ({ format, label, icon: Icon }: AlignmentItem) => (
        <DropdownMenuRadioItem key={format} value={format}>
            <Icon />
            {label}
        </DropdownMenuRadioItem>
    );

    return (
        <EditorToolbarMenu label='Perataan' trigger={<ActiveIcon />} disabled={!isEditable}>
            <DropdownMenuRadioGroup value={elementFormat || 'left'} onValueChange={handleValueChange}>
                {ALIGNMENT_ITEMS.map(renderItem)}
                <DropdownMenuSeparator />
                {DIRECTION_ITEMS.map(renderItem)}
            </DropdownMenuRadioGroup>
        </EditorToolbarMenu>
    );
}

export type { AlignmentItem };
export { ALIGNMENT_ITEMS, ElementFormatToolbarPlugin };
