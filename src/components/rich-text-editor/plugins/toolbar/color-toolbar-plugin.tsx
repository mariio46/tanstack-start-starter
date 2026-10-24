import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import { IconBucketDroplet, IconCheck, IconLetterA } from '@tabler/icons-react';
import { $getSelection } from 'lexical';

import { COLOR_SWATCHES } from '@/components/rich-text-editor/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToolbarButton } from '@/components/ui/toolbar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useFormatState } from './editor-toolbar';

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

function normalizeHex(value: string) {
    const match = HEX_PATTERN.exec(value.trim());
    if (!match) return null;

    const hex = match[1].toLowerCase();
    return `#${hex.length === 3 ? [...hex].map((char) => char + char).join('') : hex}`;
}

interface ColorPickerProps {
    label: string;
    icon: React.ReactNode;
    property: 'color' | 'background-color';
    value: string;
    disabled?: boolean;
}

function ColorPicker({ label, icon, property, value, disabled }: ColorPickerProps) {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = React.useState(false);
    const [hex, setHex] = React.useState('');
    const closedByApplyRef = React.useRef(false);

    const handleOpenChange = (next: boolean) => {
        if (next) {
            closedByApplyRef.current = false;
            setHex(value);
        }
        setOpen(next);
    };

    const apply = (color: string | null) => {
        editor.update(() => {
            const selection = $getSelection();
            if (selection) $patchStyleText(selection, { [property]: color });
        });
        closedByApplyRef.current = true;
        setOpen(false);
    };

    const finalFocus = () => {
        if (!closedByApplyRef.current) return true;

        editor.focus();
        return false;
    };

    const normalizedHex = normalizeHex(hex);

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <Tooltip>
                <TooltipTrigger
                    render={
                        <ToolbarButton
                            aria-label={label}
                            disabled={disabled}
                            className='relative'
                            render={<PopoverTrigger />}
                        />
                    }
                >
                    {icon}
                    <span
                        aria-hidden='true'
                        className='absolute inset-x-1.5 bottom-1 h-0.5 rounded-full bg-current'
                        style={value ? { backgroundColor: value } : undefined}
                    />
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
            </Tooltip>
            <PopoverContent align='start' finalFocus={finalFocus} className='w-auto'>
                <div role='group' aria-label={`Pilihan ${label.toLowerCase()}`} className='grid grid-cols-8 gap-1'>
                    {COLOR_SWATCHES.map((swatch) => {
                        const selected = swatch.value === value;

                        return (
                            <button
                                key={swatch.value}
                                type='button'
                                aria-label={swatch.label}
                                aria-pressed={selected}
                                title={swatch.label}
                                onClick={() => apply(swatch.value)}
                                className='flex size-6 items-center justify-center rounded-md shadow-xs ring-1 ring-foreground/15 outline-none ring-inset focus-visible:ring-3 focus-visible:ring-ring/50'
                                style={{ backgroundColor: swatch.value }}
                            >
                                {selected && <IconCheck className='size-3.5 text-white mix-blend-difference' />}
                            </button>
                        );
                    })}
                </div>
                <div className='flex gap-1.5'>
                    <span
                        aria-hidden='true'
                        className='size-8 shrink-0 rounded-lg ring-1 ring-foreground/15 ring-inset'
                        style={normalizedHex ? { backgroundColor: normalizedHex } : undefined}
                    />
                    <Input
                        aria-label='Warna hex'
                        placeholder='#000000'
                        value={hex}
                        aria-invalid={hex !== '' && !normalizedHex}
                        onChange={(event) => setHex(event.currentTarget.value)}
                        onKeyDown={(event) => {
                            if (event.key !== 'Enter') return;

                            event.preventDefault();
                            if (normalizedHex) apply(normalizedHex);
                        }}
                        className='w-28 font-mono'
                    />
                    <Button
                        variant='outline'
                        disabled={!normalizedHex}
                        onClick={() => normalizedHex && apply(normalizedHex)}
                    >
                        Terapkan
                    </Button>
                </div>
                <Button variant='ghost' size='sm' className='w-full' onClick={() => apply(null)}>
                    Bawaan
                </Button>
            </PopoverContent>
        </Popover>
    );
}

function ColorToolbarPlugin() {
    const { color, backgroundColor, isEditable } = useFormatState();

    return (
        <>
            <ColorPicker
                label='Warna teks'
                icon={<IconLetterA />}
                property='color'
                value={color}
                disabled={!isEditable}
            />
            <ColorPicker
                label='Warna latar'
                icon={<IconBucketDroplet />}
                property='background-color'
                value={backgroundColor}
                disabled={!isEditable}
            />
        </>
    );
}

export { ColorToolbarPlugin };
