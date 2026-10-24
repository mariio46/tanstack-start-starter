import type * as React from 'react';

import type { MenuOption } from '@lexical/react/LexicalMenuOption';

import { cn } from '@/lib/utils';

function TypeaheadMenu({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            onMouseDown={(event) => event.preventDefault()}
            className={cn(
                'max-h-72 w-60 overflow-y-auto overflow-x-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10',
                className,
            )}
            {...props}
        />
    );
}

interface TypeaheadMenuItemProps<TOption extends MenuOption> extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
    option: TOption;
    index: number;
    selected: boolean;
    onHighlight: (index: number) => void;
    onSelect: (option: TOption) => void;
}

function TypeaheadMenuItem<TOption extends MenuOption>({
    option,
    index,
    selected,
    onHighlight,
    onSelect,
    className,
    ...props
}: TypeaheadMenuItemProps<TOption>) {
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
                "flex cursor-default select-none items-center gap-2 rounded-md px-1.5 py-1 text-sm data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className,
            )}
            {...props}
        />
    );
}

function TypeaheadMenuStatus({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            role='status'
            className={cn('flex items-center gap-2 px-1.5 py-1 text-muted-foreground text-sm', className)}
            {...props}
        />
    );
}

export type { TypeaheadMenuItemProps };
export { TypeaheadMenu, TypeaheadMenuItem, TypeaheadMenuStatus };
