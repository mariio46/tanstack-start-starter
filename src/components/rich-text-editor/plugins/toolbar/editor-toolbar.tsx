import * as React from 'react';

import type { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useExtensionSignalValue } from '@lexical/react/useExtensionSignalValue';
import { useLexicalFocusManagerRef } from '@lexical/react/useLexicalFocusManagerRef';
import { IS_APPLE } from '@lexical/utils';
import { IconChevronDown } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

import { FormatStateExtension } from '@/components/rich-text-editor/extensions/format-state';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import type { ToolbarButtonProps } from '@/components/ui/toolbar';
import { Toolbar, ToolbarButton } from '@/components/ui/toolbar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const MOD_KEY = IS_APPLE ? '⌘' : 'Ctrl';

function useFormatState() {
    return useExtensionSignalValue(FormatStateExtension, 'state');
}

function EditorToolbar({ className, ...props }: React.ComponentProps<typeof Toolbar>) {
    const focusManagerRef = useLexicalFocusManagerRef({ toolbarItemSelector: 'button, input' });

    return (
        <Toolbar
            ref={focusManagerRef}
            data-slot='editor-toolbar'
            className={cn('shrink-0 overflow-x-auto border-b px-2 py-1.5 [scrollbar-width:thin]', className)}
            {...props}
        />
    );
}

function EditorToolbarTooltip({ label, shortcut }: { label: string; shortcut?: string[] }) {
    return (
        <TooltipContent>
            {label}
            {shortcut && (
                <KbdGroup>
                    {shortcut.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                    ))}
                </KbdGroup>
            )}
        </TooltipContent>
    );
}

interface EditorToolbarButtonProps extends Omit<ToolbarButtonProps, 'aria-label'> {
    label: string;
    shortcut?: string[];
    pressed?: boolean;
}

function EditorToolbarButton({ label, shortcut, pressed, ...props }: EditorToolbarButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger render={<ToolbarButton aria-label={label} aria-pressed={pressed} {...props} />} />
            <EditorToolbarTooltip label={label} shortcut={shortcut} />
        </Tooltip>
    );
}

interface EditorToolbarMenuProps {
    label: string;
    trigger: React.ReactNode;
    disabled?: boolean;
    triggerClassName?: string;
    contentClassName?: string;
    align?: React.ComponentProps<typeof DropdownMenuContent>['align'];
    children: React.ReactNode;
}

function EditorToolbarMenu({
    label,
    trigger,
    disabled,
    triggerClassName,
    contentClassName,
    align,
    children,
}: EditorToolbarMenuProps) {
    const [editor] = useLexicalComposerContext();
    const closedByItemRef = React.useRef(false);

    const handleOpenChange = (open: boolean, details: MenuPrimitive.Root.ChangeEventDetails) => {
        closedByItemRef.current = !open && details.reason === 'item-press';
    };

    const finalFocus = () => {
        if (!closedByItemRef.current) return true;

        editor.focus();
        return false;
    };

    return (
        <DropdownMenu onOpenChange={handleOpenChange}>
            <Tooltip>
                <TooltipTrigger
                    render={
                        <ToolbarButton
                            size='sm'
                            aria-label={label}
                            disabled={disabled}
                            className={cn('gap-1 px-1.5', triggerClassName)}
                            render={<DropdownMenuTrigger />}
                        />
                    }
                >
                    {trigger}
                    <IconChevronDown className='size-3.5 text-muted-foreground' />
                </TooltipTrigger>
                <EditorToolbarTooltip label={label} />
            </Tooltip>
            <DropdownMenuContent align={align} finalFocus={finalFocus} className={cn('w-auto', contentClassName)}>
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export type { EditorToolbarButtonProps, EditorToolbarMenuProps };
export { EditorToolbar, EditorToolbarButton, EditorToolbarMenu, MOD_KEY, useFormatState };
