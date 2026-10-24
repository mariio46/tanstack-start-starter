import type * as React from 'react';

import { formatFileSize, formatFileType } from '@/lib/file';

import { type JsonValue, JsonViewer } from '@/components/custom/json-viewer';

type FileValueProps = {
    files: File[];
    maxSize?: number;
    label?: string;
    action?: React.ReactNode;
};

function describeFile(file: File, maxSize: number | undefined): JsonValue {
    const description: Record<string, JsonValue> = {
        name: file.name,
        size: formatFileSize(file.size),
        type: formatFileType(file),
        last_modified: new Date(file.lastModified).toISOString(),
    };

    if (maxSize !== undefined) description.oversize = file.size > maxSize;

    return description;
}

const FileValue = ({ files, maxSize, label = 'Nilai onChange', action }: FileValueProps) => {
    const value = files.map((file) => describeFile(file, maxSize));

    return (
        <div className='grid min-w-0 content-start gap-2'>
            <div className='flex min-h-6 items-center justify-between gap-2'>
                <span className='font-medium text-sm/4'>{label}</span>
                {action}
            </div>
            <JsonViewer key={JSON.stringify(value)} data={value} rootName='value' defaultExpanded={2} />
        </div>
    );
};

export { FileValue };
