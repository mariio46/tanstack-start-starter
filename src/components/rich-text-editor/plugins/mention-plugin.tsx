import * as React from 'react';
import { createPortal } from 'react-dom';

import { MenuOption } from '@lexical/react/LexicalMenuOption';
import type { MenuRenderFn } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { LexicalTypeaheadMenuPlugin, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import type { TextNode } from 'lexical';
import { $createTextNode, $insertNodes, COMMAND_PRIORITY_CRITICAL } from 'lexical';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';

import {
    MENTION_MAX_QUERY_LENGTH,
    MENTION_MENU_LIMIT,
    MENTION_SEARCH_DELAY,
} from '@/components/rich-text-editor/constants';
import type { EditorMentions, MentionItem } from '@/components/rich-text-editor/editor-root';
import { useEditorAnchor, useEditorConfig } from '@/components/rich-text-editor/editor-root';
import { $createMentionNode } from '@/components/rich-text-editor/nodes/mention-node';
import { Spinner } from '@/components/ui/spinner';

import { TypeaheadMenu, TypeaheadMenuItem, TypeaheadMenuStatus } from './typeahead-menu';

class MentionOption extends MenuOption {
    item: MentionItem;

    constructor(item: MentionItem) {
        super(item.id);
        this.item = item;
    }
}

type MentionResults = {
    query: string;
    items: MentionItem[];
};

function getInitials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('');
}

function MentionAvatar({ item }: { item: MentionItem }) {
    return (
        <span className='flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground text-xs'>
            {item.avatar ? <img src={item.avatar} alt='' className='size-full object-cover' /> : getInitials(item.name)}
        </span>
    );
}

function MentionTypeahead({ search }: EditorMentions) {
    const anchor = useEditorAnchor();
    const [query, setQuery] = React.useState<string | null>(null);
    const [results, setResults] = React.useState<MentionResults | null>(null);
    const lastQueryRef = React.useRef<string | null>(null);
    const requestRef = React.useRef(0);

    const triggerFn = useBasicTypeaheadTriggerMatch('@', { minLength: 0, maxLength: MENTION_MAX_QUERY_LENGTH });

    const runSearch = useDebouncedCallback((next: string, request: number) => {
        const settle = (items: MentionItem[]) => {
            if (request === requestRef.current) setResults({ query: next, items: items.slice(0, MENTION_MENU_LIMIT) });
        };

        search(next).then(settle, () => settle([]));
    }, MENTION_SEARCH_DELAY);

    const handleQueryChange = (next: string | null) => {
        setQuery(next);
        if (next === lastQueryRef.current) return;

        lastQueryRef.current = next;
        requestRef.current += 1;

        if (next === null) setResults(null);
        else runSearch(next, requestRef.current);
    };

    const options = (results?.items ?? []).map((item) => new MentionOption(item));
    const loading = query !== null && results?.query !== query;

    const handleSelectOption = (option: MentionOption, textNode: TextNode | null, closeMenu: () => void) => {
        const mention = $createMentionNode(option.item.id, option.item.name);
        const space = $createTextNode(' ');

        if (textNode) textNode.replace(mention);
        else $insertNodes([mention]);
        mention.insertAfter(space);
        space.select();
        closeMenu();
    };

    const renderMenu: MenuRenderFn<MentionOption> = (
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex, options: menuOptions },
    ) => {
        if (!anchorElementRef.current) return null;

        return createPortal(
            <TypeaheadMenu data-slot='editor-mention-menu'>
                {menuOptions.map((option, index) => (
                    <TypeaheadMenuItem
                        key={option.key}
                        option={option}
                        index={index}
                        selected={selectedIndex === index}
                        onHighlight={setHighlightedIndex}
                        onSelect={selectOptionAndCleanUp}
                    >
                        <MentionAvatar item={option.item} />
                        <span className='flex min-w-0 flex-col'>
                            <span className='truncate'>{option.item.name}</span>
                            {option.item.description && (
                                <span className='truncate text-muted-foreground text-xs'>
                                    {option.item.description}
                                </span>
                            )}
                        </span>
                    </TypeaheadMenuItem>
                ))}
                {menuOptions.length === 0 &&
                    (loading ? (
                        <TypeaheadMenuStatus>
                            <Spinner />
                            Mencari…
                        </TypeaheadMenuStatus>
                    ) : (
                        <TypeaheadMenuStatus>Orang tidak ditemukan</TypeaheadMenuStatus>
                    ))}
            </TypeaheadMenu>,
            anchorElementRef.current,
        );
    };

    return (
        <LexicalTypeaheadMenuPlugin<MentionOption>
            options={options}
            triggerFn={triggerFn}
            onQueryChange={handleQueryChange}
            onSelectOption={handleSelectOption}
            menuRenderFn={renderMenu}
            commandPriority={COMMAND_PRIORITY_CRITICAL}
            parent={anchor ?? undefined}
            anchorClassName='z-50'
        />
    );
}

function MentionPlugin() {
    const { mentions } = useEditorConfig();
    if (!mentions) return null;

    return <MentionTypeahead search={mentions.search} />;
}

export { MentionPlugin };
