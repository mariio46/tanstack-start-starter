import * as React from 'react';

import { Link, type LinkProps, useMatches } from '@tanstack/react-router';

import { cn } from '@/lib/utils';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type BreadcrumbPath = Extract<LinkProps['to'], string>;

const toBreadcrumbPath = (fullPath: string) => fullPath.replace(/(.)\/$/, '$1') as BreadcrumbPath;

const RouteBreadcrumb = ({ className, ...props }: React.ComponentProps<typeof Breadcrumb>) => {
    const breadcrumbs = useMatches({
        select: (matches) =>
            matches
                .map((match) => ({
                    id: match.id,
                    label: match.staticData.breadcrumb,
                    to: toBreadcrumbPath(match.fullPath),
                }))
                .filter((breadcrumb) => Boolean(breadcrumb.label)),
    });

    if (breadcrumbs.length === 0) return null;

    return (
        <Breadcrumb {...props}>
            <BreadcrumbList className={cn('text-xs', className)}>
                {breadcrumbs.map((breadcrumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <React.Fragment key={breadcrumb.id}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink render={<Link to={breadcrumb.to} />}>
                                        {breadcrumb.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export { RouteBreadcrumb };
