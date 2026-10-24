import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IconMoodSmile } from '@tabler/icons-react';

import { $insertEmoji, EmojiPicker } from '@/components/rich-text-editor/plugins/emoji-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ToolbarButton } from '@/components/ui/toolbar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useFormatState } from './editor-toolbar';

const LABEL = 'Emoji';

function EmojiToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { isEditable } = useFormatState();
    const [open, setOpen] = React.useState(false);
    const closedBySelectRef = React.useRef(false);

    const handleOpenChange = (next: boolean) => {
        if (next) closedBySelectRef.current = false;
        setOpen(next);
    };

    const finalFocus = () => {
        if (!closedBySelectRef.current) return true;

        editor.focus();
        return false;
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <Tooltip>
                <TooltipTrigger
                    render={<ToolbarButton aria-label={LABEL} disabled={!isEditable} render={<PopoverTrigger />} />}
                >
                    <IconMoodSmile />
                </TooltipTrigger>
                <TooltipContent>{LABEL}</TooltipContent>
            </Tooltip>
            <PopoverContent align='end' finalFocus={finalFocus} className='w-auto'>
                <EmojiPicker
                    onSelect={(emoji) => {
                        editor.update(() => $insertEmoji(emoji.emoji));
                        closedBySelectRef.current = true;
                        setOpen(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

export { EmojiToolbarPlugin };
