import * as React from 'react';
import { createPortal } from 'react-dom';

import { MenuOption } from '@lexical/react/LexicalMenuOption';
import type { MenuRenderFn, TriggerFn } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { LexicalTypeaheadMenuPlugin, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import type { TextNode } from 'lexical';
import { COMMAND_PRIORITY_CRITICAL } from 'lexical';

import { cn } from '@/lib/utils';

import { useEditorAnchor } from '@/components/rich-text-editor/editor-root';

type SlashMenuItem = {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    description?: string;
    group?: string;
    keywords?: string[];
    onSelect: (query: string) => void;
};

type SlashMenuItems = SlashMenuItem[] | ((query: string) => SlashMenuItem[]);

type SlashMenuRegistry = Map<string, SlashMenuItems>;

type SlashMenuVariant = 'default' | 'detailed';

const SlashMenuContext = React.createContext<React.Dispatch<React.SetStateAction<SlashMenuRegistry>> | null>(null);

function useSlashMenuItems(items: SlashMenuItems) {
    const setRegistry = React.useContext(SlashMenuContext);
    if (!setRegistry) throw new Error('useSlashMenuItems must be used within an EditorSlashMenu');

    const id = React.useId();

    React.useEffect(
        () => () =>
            setRegistry((current) => {
                const next = new Map(current);
                next.delete(id);
                return next;
            }),
        [setRegistry, id],
    );

    React.useEffect(() => {
        setRegistry((current) => new Map(current).set(id, items));
    }, [setRegistry, id, items]);
}

class SlashMenuOption extends MenuOption {
    item: SlashMenuItem;

    constructor(item: SlashMenuItem) {
        super(item.value);
        this.item = item;
    }
}

function matchesQuery(item: SlashMenuItem, query: string) {
    const normalized = query.toLowerCase();

    return [item.label, ...(item.keywords ?? [])].some((text) => text.toLowerCase().includes(normalized));
}

function resolveItems(registry: SlashMenuRegistry, query: string) {
    return [...registry.values()].flatMap((items) =>
        typeof items === 'function' ? items(query) : items.filter((item) => matchesQuery(item, query)),
    );
}

function groupOptions(options: SlashMenuOption[]) {
    const groups = new Map<string, { option: SlashMenuOption; index: number }[]>();

    options.forEach((option, index) => {
        const group = option.item.group ?? '';
        groups.set(group, [...(groups.get(group) ?? []), { option, index }]);
    });

    return [...groups.entries()];
}

type SlashMenuRowProps = {
    option: SlashMenuOption;
    index: number;
    selected: boolean;
    detailed: boolean;
    onHighlight: (index: number) => void;
    onSelect: (option: SlashMenuOption) => void;
};

function SlashMenuRow({ option, index, selected, detailed, onHighlight, onSelect }: SlashMenuRowProps) {
    const { label, description, icon: Icon } = option.item;

    return (
        <div
            ref={option.setRefElement}
            id={`typeahead-item-${index}`}
            role='option'
            tabIndex={-1}
            aria-selected={selected}
            data-highlighted={selected || undefined}
            onMouseEnter={() => onHighlight(index)}
            onClick={() => {
                onHighlight(index);
                onSelect(option);
            }}
            className={cn(
                "flex cursor-default select-none items-center gap-1.5 rounded-md px-1.5 py-1 text-sm data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                detailed && 'gap-2.5',
            )}
        >
            {detailed ? (
                <>
                    <span className='flex size-8 shrink-0 items-center justify-center rounded-md border bg-background text-foreground'>
                        {Icon && <Icon />}
                    </span>
                    <span className='flex min-w-0 flex-col'>
                        <span className='truncate'>{label}</span>
                        {description && <span className='truncate text-muted-foreground text-xs'>{description}</span>}
                    </span>
                </>
            ) : (
                <>
                    {Icon && <Icon />}
                    <span className='truncate'>{label}</span>
                </>
            )}
        </div>
    );
}

interface EditorSlashMenuProps {
    variant?: SlashMenuVariant;
    children?: React.ReactNode;
}

function EditorSlashMenu({ variant = 'default', children }: EditorSlashMenuProps) {
    const anchor = useEditorAnchor();
    const [registry, setRegistry] = React.useState<SlashMenuRegistry>(() => new Map());
    const [query, setQuery] = React.useState<string | null>(null);

    const detailed = variant === 'detailed';

    const baseTriggerFn = useBasicTypeaheadTriggerMatch('/', { minLength: 0, maxLength: 32, allowWhitespace: true });

    const triggerFn: TriggerFn = (text, editor) => {
        const match = baseTriggerFn(text, editor);
        if (!match || /^\s/.test(match.matchingString)) return null;

        return resolveItems(registry, match.matchingString).length > 0 ? match : null;
    };

    const options = query === null ? [] : resolveItems(registry, query).map((item) => new SlashMenuOption(item));

    const handleSelectOption = (
        option: SlashMenuOption,
        textNode: TextNode | null,
        closeMenu: () => void,
        matchingString: string,
    ) => {
        textNode?.remove();
        option.item.onSelect(matchingString);
        closeMenu();
    };

    const renderMenu: MenuRenderFn<SlashMenuOption> = (
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex, options: menuOptions },
    ) => {
        if (!anchorElementRef.current || menuOptions.length === 0) return null;

        const rowProps = { detailed, onHighlight: setHighlightedIndex, onSelect: selectOptionAndCleanUp };

        return createPortal(
            <div
                data-slot='editor-slash-menu'
                data-variant={variant}
                onMouseDown={(event) => event.preventDefault()}
                className={cn(
                    'max-h-80 overflow-y-auto overflow-x-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10',
                    detailed ? 'w-72' : 'w-56',
                )}
            >
                {detailed
                    ? groupOptions(menuOptions).map(([group, entries]) => (
                          <div key={group} role='group' aria-label={group || undefined}>
                              {group && (
                                  <div aria-hidden className='px-1.5 py-1 font-medium text-muted-foreground text-xs'>
                                      {group}
                                  </div>
                              )}
                              {entries.map(({ option, index }) => (
                                  <SlashMenuRow
                                      key={option.key}
                                      option={option}
                                      index={index}
                                      selected={selectedIndex === index}
                                      {...rowProps}
                                  />
                              ))}
                          </div>
                      ))
                    : menuOptions.map((option, index) => (
                          <SlashMenuRow
                              key={option.key}
                              option={option}
                              index={index}
                              selected={selectedIndex === index}
                              {...rowProps}
                          />
                      ))}
            </div>,
            anchorElementRef.current,
        );
    };

    return (
        <SlashMenuContext.Provider value={setRegistry}>
            {children}
            <LexicalTypeaheadMenuPlugin<SlashMenuOption>
                options={options}
                triggerFn={triggerFn}
                onQueryChange={setQuery}
                onSelectOption={handleSelectOption}
                menuRenderFn={renderMenu}
                commandPriority={COMMAND_PRIORITY_CRITICAL}
                parent={anchor ?? undefined}
                anchorClassName='z-50'
            />
        </SlashMenuContext.Provider>
    );
}

export type { EditorSlashMenuProps, SlashMenuItem, SlashMenuItems, SlashMenuVariant };
export { EditorSlashMenu, useSlashMenuItems };
