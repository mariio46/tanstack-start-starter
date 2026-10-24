import * as React from 'react';

import { $getRoot, $getSelection, $isRangeSelection } from 'lexical';

import type { Emoji } from '@/components/rich-text-editor/constants';
import { EMOJIS } from '@/components/rich-text-editor/constants';
import { Input } from '@/components/ui/input';

function filterEmojis(query: string) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return EMOJIS;

    const prefix: Emoji[] = [];
    const rest: Emoji[] = [];

    for (const emoji of EMOJIS) {
        if (emoji.name.startsWith(normalized)) prefix.push(emoji);
        else if (emoji.name.includes(normalized) || emoji.keywords.some((keyword) => keyword.includes(normalized))) {
            rest.push(emoji);
        }
    }

    return [...prefix, ...rest];
}

function $insertEmoji(emoji: string) {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) selection.insertText(emoji);
    else $getRoot().selectEnd().insertText(emoji);
}

interface EmojiPickerProps {
    onSelect: (emoji: Emoji) => void;
}

function EmojiPicker({ onSelect }: EmojiPickerProps) {
    const [query, setQuery] = React.useState('');

    const emojis = filterEmojis(query);

    return (
        <div className='grid gap-2'>
            <Input
                aria-label='Cari emoji'
                placeholder='Cari emoji…'
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;

                    event.preventDefault();
                    if (emojis[0]) onSelect(emojis[0]);
                }}
            />
            {emojis.length > 0 ? (
                <div
                    role='group'
                    aria-label='Emoji'
                    className='grid max-h-56 grid-cols-8 gap-0.5 overflow-y-auto [scrollbar-width:thin]'
                >
                    {emojis.map((emoji) => (
                        <button
                            key={emoji.name}
                            type='button'
                            aria-label={emoji.name.replaceAll('_', ' ')}
                            title={`:${emoji.name}:`}
                            onClick={() => onSelect(emoji)}
                            className='flex size-8 items-center justify-center rounded-md text-lg outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50'
                        >
                            {emoji.emoji}
                        </button>
                    ))}
                </div>
            ) : (
                <p className='py-6 text-center text-muted-foreground text-sm'>Emoji tidak ditemukan.</p>
            )}
        </div>
    );
}

export type { EmojiPickerProps };
export { $insertEmoji, EmojiPicker, filterEmojis };
