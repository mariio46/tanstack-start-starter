import * as React from 'react';

import { FileUpload } from '@/components/custom/file-upload';

import { MULTIPLE_MAX, MULTIPLE_MIN } from './constants';
import { FileValue } from './file-value';

const MultipleFileUpload = () => {
    const [files, setFiles] = React.useState<File[]>([]);

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <div className='min-w-0'>
                <FileUpload.Root multiple min={MULTIPLE_MIN} max={MULTIPLE_MAX} onChange={setFiles} />
            </div>
            <FileValue files={files} />
        </div>
    );
};

export { MultipleFileUpload };
