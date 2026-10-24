import * as React from 'react';

import { FileUpload } from '@/components/custom/file-upload';

import { FileValue } from './file-value';

const BasicFileUpload = () => {
    const [files, setFiles] = React.useState<File[]>([]);

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <div className='min-w-0'>
                <FileUpload.Root onChange={setFiles} />
            </div>
            <FileValue files={files} />
        </div>
    );
};

export { BasicFileUpload };
