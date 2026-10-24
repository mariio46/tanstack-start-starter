import * as React from 'react';

import { FileUpload } from '@/components/custom/file-upload';

import { DOCUMENT_MAX_SIZE, DOCUMENT_MIMES } from './constants';
import { FileValue } from './file-value';

const ConstraintsFileUpload = () => {
    const [files, setFiles] = React.useState<File[]>([]);

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <div className='min-w-0'>
                <FileUpload.Root multiple mimes={DOCUMENT_MIMES} maxSize={DOCUMENT_MAX_SIZE} onChange={setFiles} />
            </div>
            <FileValue files={files} maxSize={DOCUMENT_MAX_SIZE} />
        </div>
    );
};

export { ConstraintsFileUpload };
