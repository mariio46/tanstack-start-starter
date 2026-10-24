import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import { $getSelection } from 'lexical';

import { FONT_FAMILIES } from '@/components/rich-text-editor/constants';
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';

import { EditorToolbarMenu, useFormatState } from './editor-toolbar';

function FontFamilyToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { fontFamily, isEditable } = useFormatState();

    const activeLabel = FONT_FAMILIES.find(({ value }) => value === fontFamily)?.label ?? fontFamily;

    const handleValueChange = (value: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if (selection) $patchStyleText(selection, { 'font-family': value || null });
        });
    };

    return (
        <EditorToolbarMenu
            label='Jenis font'
            trigger={<span className='w-24 truncate text-start'>{activeLabel}</span>}
            disabled={!isEditable}
        >
            <DropdownMenuRadioGroup value={fontFamily} onValueChange={handleValueChange}>
                {FONT_FAMILIES.map(({ label, value }) => (
                    <DropdownMenuRadioItem key={label} value={value} style={{ fontFamily: value || undefined }}>
                        {label}
                    </DropdownMenuRadioItem>
                ))}
            </DropdownMenuRadioGroup>
        </EditorToolbarMenu>
    );
}

export { FontFamilyToolbarPlugin };
