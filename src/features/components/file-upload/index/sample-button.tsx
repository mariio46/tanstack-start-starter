import * as React from 'react';

import { Button } from '@/components/ui/button';

type SampleButtonProps = Omit<React.ComponentProps<typeof Button>, 'onClick'> & {
    load: () => Promise<File[]>;
    onLoaded: (files: File[]) => void;
};

const SampleButton = ({ load, onLoaded, disabled, ...props }: SampleButtonProps) => {
    const [loading, setLoading] = React.useState(false);

    async function handleClick() {
        setLoading(true);

        try {
            onLoaded(await load());
        } finally {
            setLoading(false);
        }
    }

    return <Button size='sm' disabled={disabled || loading} onClick={handleClick} {...props} />;
};

export { SampleButton };
