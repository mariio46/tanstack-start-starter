import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const iconTileVariants = cva(
    [
        'relative inline-flex shrink-0 items-center justify-center align-middle',
        'size-(--icon-tile-size) rounded-(--icon-tile-radius)',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-(--icon-tile-icon-size)',
    ],
    {
        variants: {
            variant: {
                outline: 'border border-border bg-background dark:bg-input/32',
                elevated:
                    'border-2 border-background bg-muted text-accent-foreground shadow-[0_1px_3px_0_rgb(0_0_0/0.14)] dark:border',
                soft: [
                    'isolate p-(--icon-tile-inset) text-primary bg-current/10',
                    'after:absolute after:-z-10 after:inset-(--icon-tile-inset)',
                    'after:rounded-[calc(var(--icon-tile-radius)-var(--icon-tile-inset))]',
                    'after:border after:border-current/20 after:bg-current/5',
                ],
                solid: 'bg-primary text-primary-foreground',
                frame: [
                    'isolate border border-border bg-muted/50 p-(--icon-tile-inset)',
                    'after:absolute after:-z-10 after:inset-(--icon-tile-inset)',
                    'after:rounded-[calc(var(--icon-tile-radius)-var(--icon-tile-inset))]',
                    'after:border after:border-border after:bg-card after:shadow-xs',
                ],
            },
            size: {
                xs: '[--icon-tile-size:--spacing(6)] [--icon-tile-icon-size:--spacing(3.5)] [--icon-tile-inset:--spacing(0.5)]',
                sm: '[--icon-tile-size:--spacing(8)] [--icon-tile-icon-size:--spacing(4)] [--icon-tile-inset:--spacing(0.5)]',
                default:
                    '[--icon-tile-size:--spacing(10)] [--icon-tile-icon-size:--spacing(4.5)] [--icon-tile-inset:--spacing(0.75)]',
                lg: '[--icon-tile-size:--spacing(12)] [--icon-tile-icon-size:--spacing(5.5)] [--icon-tile-inset:--spacing(0.75)]',
                xl: '[--icon-tile-size:--spacing(14)] [--icon-tile-icon-size:--spacing(7)] [--icon-tile-inset:--spacing(1)]',
            },
            radius: {
                default:
                    '[--icon-tile-radius:min(var(--radius-md),calc(var(--icon-tile-size)/3))] [--icon-tile-radius:min(var(--radius-md),calc(var(--icon-tile-size)/3))]',
                full: '[--icon-tile-radius:calc(infinity*1px)]',
            },
        },
        defaultVariants: {
            variant: 'outline',
            size: 'default',
            radius: 'default',
        },
    },
);

interface IconTileProps extends useRender.ComponentProps<'span'> {
    variant?: VariantProps<typeof iconTileVariants>['variant'];
    size?: VariantProps<typeof iconTileVariants>['size'];
    radius?: VariantProps<typeof iconTileVariants>['radius'];
}

function IconTile({
    className,
    variant = 'outline',
    size = 'default',
    radius = 'default',
    render,
    ...props
}: IconTileProps) {
    const defaultProps = {
        'data-slot': 'icon-tile',
        'data-variant': variant,
        'data-size': size,
        className: cn(iconTileVariants({ variant, size, radius, className })),
    };

    return useRender({
        defaultTagName: 'span',
        render,
        props: mergeProps<'span'>(defaultProps, props),
    });
}

export { IconTile, type IconTileProps, iconTileVariants };
