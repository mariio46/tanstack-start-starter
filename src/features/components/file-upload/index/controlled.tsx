import * as React from 'react';

import { IconFiles } from '@tabler/icons-react';

import { FileUpload } from '@/components/custom/file-upload';
import { Button } from '@/components/ui/button';

import { SAMPLE_MAX_SIZE } from './constants';
import { FileValue } from './file-value';
import { SampleButton } from './sample-button';
import { createSampleFiles } from './samples';

const ControlledFileUpload = () => {
    const [files, setFiles] = React.useState<File[]>([]);

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <div className='min-w-0'>
                <FileUpload.Root
                    value={files}
                    onChange={setFiles}
                    multiple
                    maxSize={SAMPLE_MAX_SIZE}
                    ActionButton={
                        <SampleButton load={createSampleFiles} onLoaded={setFiles}>
                            <IconFiles data-icon='inline-start' />
                            Muat contoh
                        </SampleButton>
                    }
                />
            </div>
            <FileValue
                files={files}
                maxSize={SAMPLE_MAX_SIZE}
                label='State parent'
                action={
                    <Button variant='outline' size='xs' disabled={files.length === 0} onClick={() => setFiles([])}>
                        Kosongkan
                    </Button>
                }
            />
        </div>
    );
};

export { ControlledFileUpload };
