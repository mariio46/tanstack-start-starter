import * as React from 'react';
import { createPortal } from 'react-dom';

import { MenuOption } from '@lexical/react/LexicalMenuOption';
import type { MenuRenderFn, TriggerFn } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { LexicalTypeaheadMenuPlugin, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import type { TextNode } from 'lexical';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL } from 'lexical';

import type { Emoji } from '@/components/rich-text-editor/constants';
import { useEditorAnchor } from '@/components/rich-text-editor/editor-root';

import { filterEmojis } from './emoji-picker';
import { TypeaheadMenu, TypeaheadMenuItem } from './typeahead-menu';

const EMOJI_MENU_LIMIT = 8;

const EMOJI_PUNCTUATION = '\\.,\\*\\?\\$\\@\\|#{}\\(\\)\\^\\[\\]\\\\/!%\'"~=<>:;';

class EmojiOption extends MenuOption {
    emoji: Emoji;

    constructor(emoji: Emoji) {
        super(emoji.name);
        this.emoji = emoji;
    }
}

function EmojiPlugin() {
    const anchor = useEditorAnchor();
    const [query, setQuery] = React.useState<string | null>(null);

    const baseTriggerFn = useBasicTypeaheadTriggerMatch(':', {
        minLength: 2,
        maxLength: 32,
        punctuation: EMOJI_PUNCTUATION,
    });

    const triggerFn: TriggerFn = (text, editor) => {
        const match = baseTriggerFn(text, editor);

        return match && filterEmojis(match.matchingString).length > 0 ? match : null;
    };

    const options =
        query === null
            ? []
            : filterEmojis(query)
                  .slice(0, EMOJI_MENU_LIMIT)
                  .map((emoji) => new EmojiOption(emoji));

    const handleSelectOption = (option: EmojiOption, textNode: TextNode | null, closeMenu: () => void) => {
        textNode?.remove();

        const selection = $getSelection();
        if ($isRangeSelection(selection)) selection.insertText(option.emoji.emoji);
        closeMenu();
    };

    const renderMenu: MenuRenderFn<EmojiOption> = (
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex, options: menuOptions },
    ) => {
        if (!anchorElementRef.current || menuOptions.length === 0) return null;

        return createPortal(
            <TypeaheadMenu data-slot='editor-emoji-menu' className='w-56'>
                {menuOptions.map((option, index) => (
                    <TypeaheadMenuItem
                        key={option.key}
                        option={option}
                        index={index}
                        selected={selectedIndex === index}
                        onHighlight={setHighlightedIndex}
                        onSelect={selectOptionAndCleanUp}
                    >
                        <span aria-hidden className='w-5 text-center text-base'>
                            {option.emoji.emoji}
                        </span>
                        <span className='truncate'>:{option.emoji.name}:</span>
                    </TypeaheadMenuItem>
                ))}
            </TypeaheadMenu>,
            anchorElementRef.current,
        );
    };

    return (
        <LexicalTypeaheadMenuPlugin<EmojiOption>
            options={options}
            triggerFn={triggerFn}
            onQueryChange={setQuery}
            onSelectOption={handleSelectOption}
            menuRenderFn={renderMenu}
            commandPriority={COMMAND_PRIORITY_CRITICAL}
            parent={anchor ?? undefined}
            anchorClassName='z-50'
        />
    );
}

export { EmojiPlugin };
