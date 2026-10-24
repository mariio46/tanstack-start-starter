import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { Separator } from '@/components/ui/separator';

export const groupVariants = cva(
    "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
    {
        defaultVariants: {
            orientation: 'horizontal',
        },
        variants: {
            orientation: {
                horizontal:
                    '*:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0',
                vertical:
                    'flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0',
            },
        },
    },
);

export function Group({
    className,
    orientation,
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof groupVariants>): React.ReactElement {
    return (
        <div
            className={cn(groupVariants({ orientation }), className)}
            data-orientation={orientation}
            data-slot='group'
            role='group'
            {...props}
        />
    );
}

export function GroupText({ className, render, ...props }: useRender.ComponentProps<'div'>): React.ReactElement {
    const defaultProps = {
        className: cn(
            "flex items-center gap-2 rounded-lg border bg-muted px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
            className,
        ),
        'data-slot': 'group-text',
    };
    return useRender({
        defaultTagName: 'div',
        props: mergeProps<'div'>(defaultProps, props),
        render,
    });
}

export function GroupSeparator({
    className,
    orientation = 'vertical',
    ...props
}: React.ComponentProps<typeof Separator>): React.ReactElement {
    return (
        <Separator
            className={cn(
                'relative self-stretch bg-input data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto',
                className,
            )}
            data-slot='group-separator'
            orientation={orientation}
            {...props}
        />
    );
}
