import { IconLoader } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
        <IconLoader
            data-slot='spinner'
            role='status'
            aria-label='Memuat'
            className={cn('size-4 animate-spin', className)}
            {...props}
        />
    );
}

export { Spinner };
