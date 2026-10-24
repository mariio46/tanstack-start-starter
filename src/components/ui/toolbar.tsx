import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/button';

function Toolbar({ className, 'aria-label': ariaLabel = 'Format', ...props }: ToolbarPrimitive.Root.Props) {
    return (
        <ToolbarPrimitive.Root
            data-slot='toolbar'
            aria-label={ariaLabel}
            className={cn(
                'flex items-center gap-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
                className,
            )}
            {...props}
        />
    );
}

function ToolbarGroup({ className, ...props }: ToolbarPrimitive.Group.Props) {
    return (
        <ToolbarPrimitive.Group
            data-slot='toolbar-group'
            className={cn('flex items-center gap-0.5 data-[orientation=vertical]:flex-col', className)}
            {...props}
        />
    );
}

interface ToolbarButtonProps extends ToolbarPrimitive.Button.Props {
    variant?: VariantProps<typeof buttonVariants>['variant'];
    size?: VariantProps<typeof buttonVariants>['size'];
}

function ToolbarButton({ className, variant = 'ghost', size = 'icon-sm', ...props }: ToolbarButtonProps) {
    return (
        <ToolbarPrimitive.Button
            data-slot='toolbar-button'
            className={cn(
                buttonVariants({ variant, size }),
                'aria-pressed:bg-muted aria-pressed:text-foreground data-pressed:bg-muted data-pressed:text-foreground data-popup-open:bg-muted data-disabled:pointer-events-none data-disabled:opacity-50',
                className,
            )}
            {...props}
        />
    );
}

function ToolbarSeparator({ className, ...props }: ToolbarPrimitive.Separator.Props) {
    return (
        <ToolbarPrimitive.Separator
            data-slot='toolbar-separator'
            className={cn(
                'shrink-0 bg-border data-[orientation=horizontal]:mx-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:mx-1 data-[orientation=vertical]:h-5 data-[orientation=vertical]:w-px',
                className,
            )}
            {...props}
        />
    );
}

function ToolbarInput({ className, ...props }: ToolbarPrimitive.Input.Props) {
    return (
        <ToolbarPrimitive.Input
            data-slot='toolbar-input'
            className={cn(
                'h-7 w-full min-w-0 rounded-md border border-input bg-transparent px-2 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
                className,
            )}
            {...props}
        />
    );
}

export { Toolbar, ToolbarButton, type ToolbarButtonProps, ToolbarGroup, ToolbarInput, ToolbarSeparator };
