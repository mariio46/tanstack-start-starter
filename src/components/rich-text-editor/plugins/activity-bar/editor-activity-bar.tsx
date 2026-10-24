import type * as React from 'react';

import { cn } from '@/lib/utils';

import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function EditorActivityBar({ className, children, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='editor-activity-bar'
            className={cn('shrink-0 overflow-x-auto border-t [scrollbar-width:thin]', className)}
            {...props}
        >
            <div className='flex h-10 w-max min-w-full items-center justify-between gap-4 px-3 text-muted-foreground text-xs'>
                {children}
            </div>
        </div>
    );
}

function EditorActivityBarGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('flex items-center gap-0.5', className)} {...props} />;
}

interface EditorActivityBarButtonProps extends Omit<ButtonProps, 'aria-label'> {
    label: string;
    pressed?: boolean;
}

function EditorActivityBarButton({ label, pressed, className, ...props }: EditorActivityBarButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button
                        variant='ghost'
                        size='icon-xs'
                        aria-label={label}
                        aria-pressed={pressed}
                        className={cn('aria-pressed:bg-muted aria-pressed:text-foreground', className)}
                        {...props}
                    />
                }
            />
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}

export type { EditorActivityBarButtonProps };
export { EditorActivityBar, EditorActivityBarButton, EditorActivityBarGroup };
