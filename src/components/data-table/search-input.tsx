import * as React from 'react';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';

type DataTableSearchProps = {
    value: string;
    onValueChange: (value: string) => void;
    delay?: number;
    placeholder?: string;
    className?: string;
};

const DataTableSearch = ({
    value,
    onValueChange,
    delay = 750,
    placeholder = 'Cari...',
    className,
}: DataTableSearchProps) => {
    const [draft, setDraft] = React.useState(value);

    const emitValue = useDebouncedCallback((next: string) => onValueChange(next), delay);

    React.useEffect(() => {
        setDraft(value);
    }, [value]);

    return (
        <Input
            placeholder={placeholder}
            className={cn('sm:max-w-80 h-7', className)}
            value={draft}
            onChange={(event) => {
                const next = event.target.value;

                setDraft(next);
                emitValue(next);
            }}
        />
    );
};

export type { DataTableSearchProps };
export { DataTableSearch };
