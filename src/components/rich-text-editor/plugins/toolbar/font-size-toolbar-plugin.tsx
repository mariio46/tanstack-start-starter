import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { $getSelection } from 'lexical';

import { FONT_SIZE_DEFAULT, FONT_SIZE_MAX, FONT_SIZE_MIN } from '@/components/rich-text-editor/constants';
import { ButtonGroup } from '@/components/ui/button-group';
import { ToolbarInput } from '@/components/ui/toolbar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { EditorToolbarButton, useFormatState } from './editor-toolbar';

function clampFontSize(size: number) {
    return Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, Math.round(size)));
}

function parseFontSize(value: string | null) {
    const size = Number.parseFloat(value ?? '');
    return Number.isNaN(size) ? FONT_SIZE_DEFAULT : size;
}

function $stepFontSize(delta: number) {
    const selection = $getSelection();
    if (!selection) return;

    $patchStyleText(selection, {
        'font-size': (current) => `${clampFontSize(parseFontSize(current) + delta)}px`,
    });
}

function $setFontSize(size: number) {
    const selection = $getSelection();
    if (!selection) return;

    const next = clampFontSize(size);
    $patchStyleText(selection, { 'font-size': next === FONT_SIZE_DEFAULT ? null : `${next}px` });
}

function FontSizeToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { fontSize, isEditable } = useFormatState();

    const [draft, setDraft] = React.useState<string | null>(null);
    const skipBlurRef = React.useRef(false);

    const current = parseFontSize(fontSize);

    const commit = (value: string) => {
        const size = Number.parseFloat(value);
        if (Number.isNaN(size) || clampFontSize(size) === current) return;

        editor.update(() => $setFontSize(size));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter' && event.key !== 'Escape') return;

        event.preventDefault();
        if (event.key === 'Enter' && draft !== null) commit(draft);
        skipBlurRef.current = true;
        setDraft(null);
        editor.focus();
    };

    const handleBlur = () => {
        if (!skipBlurRef.current && draft !== null) commit(draft);
        skipBlurRef.current = false;
        setDraft(null);
    };

    return (
        <ButtonGroup aria-label='Ukuran font'>
            <EditorToolbarButton
                label='Perkecil ukuran font'
                variant='outline'
                disabled={!isEditable || current <= FONT_SIZE_MIN}
                onClick={() => editor.update(() => $stepFontSize(-1))}
            >
                <IconMinus />
            </EditorToolbarButton>
            <Tooltip>
                <TooltipTrigger
                    render={
                        <ToolbarInput
                            aria-label='Ukuran font'
                            inputMode='numeric'
                            disabled={!isEditable}
                            value={draft ?? String(current)}
                            onFocus={(event) => {
                                setDraft(String(current));
                                event.currentTarget.select();
                            }}
                            onChange={(event) => setDraft(event.currentTarget.value.replace(/[^\d.]/g, ''))}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            className='w-10 rounded-none text-center tabular-nums'
                        />
                    }
                />
                <TooltipContent>Ukuran font</TooltipContent>
            </Tooltip>
            <EditorToolbarButton
                label='Perbesar ukuran font'
                variant='outline'
                disabled={!isEditable || current >= FONT_SIZE_MAX}
                onClick={() => editor.update(() => $stepFontSize(1))}
            >
                <IconPlus />
            </EditorToolbarButton>
        </ButtonGroup>
    );
}

export { $setFontSize, $stepFontSize, FontSizeToolbarPlugin };
