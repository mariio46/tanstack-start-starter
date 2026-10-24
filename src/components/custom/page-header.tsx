import { cn } from '@/lib/utils';

const PageHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return <div data-slot='page-header' className={cn('bg-muted/55', className)} {...props} />;
};

const PageHeaderFrame = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return (
        <div
            data-slot='page-header-frame'
            className={cn('px-4 py-6 sm:py-8 flex items-center justify-between gap-3', className)}
            {...props}
        />
    );
};

const PageHeaderContent = (props: React.ComponentProps<'div'>) => {
    return <div data-slot='page-header-content' {...props} />;
};

const PageHeaderTitle = ({ className, ...props }: React.ComponentProps<'h1'>) => {
    return (
        <h1
            data-slot='page-header-title'
            className={cn('text-foreground font-heading font-bold text-xl', className)}
            {...props}
        />
    );
};

const PageHeaderActions = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return <div data-slot='page-header-actions' className={cn('flex items-center gap-1.5', className)} {...props} />;
};

const PageHeaderBreadcrumb = ({ className, ...props }: React.ComponentProps<'div'>) => {
    return <div data-slot='page-header-breadcrumb' className={cn('px-4 py-2 border-t', className)} {...props} />;
};

export { PageHeader, PageHeaderActions, PageHeaderBreadcrumb, PageHeaderContent, PageHeaderFrame, PageHeaderTitle };
