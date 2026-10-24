import * as React from 'react';

import { IconPhotoPlus } from '@tabler/icons-react';

import { formatFileSize, formatFileType, getFileKey } from '@/lib/file';

import { FileUpload } from '@/components/custom/file-upload';

import { IMAGE_MAX_SIZE, IMAGE_MIMES } from './constants';
import { SampleButton } from './sample-button';
import { createSampleImages } from './samples';

type ImageSize = {
    width: number;
    height: number;
};

function useImageSize(file: File) {
    const [size, setSize] = React.useState<ImageSize | null>();

    React.useEffect(() => {
        let cancelled = false;

        createImageBitmap(file)
            .then((bitmap) => {
                if (!cancelled) setSize({ width: bitmap.width, height: bitmap.height });
                bitmap.close();
            })
            .catch(() => {
                if (!cancelled) setSize(null);
            });

        return () => {
            cancelled = true;
        };
    }, [file]);

    return size;
}

function formatImageSize(size: ImageSize | null | undefined) {
    if (size === undefined) return 'Membaca dimensi…';
    if (size === null) return 'Dimensi tidak terbaca';

    return `${size.width} × ${size.height} px`;
}

const ImageFileDetails = ({ file }: { file: File }) => {
    const size = useImageSize(file);

    return (
        <li className='grid gap-0.5 rounded-lg border bg-background p-3'>
            <span className='truncate font-medium text-sm/4' title={file.name}>
                {file.name}
            </span>
            <span className='text-muted-foreground text-xs tabular-nums'>
                {formatImageSize(size)} · {formatFileSize(file.size)} · {formatFileType(file)}
            </span>
        </li>
    );
};

const ImageEditorFileUpload = () => {
    const [files, setFiles] = React.useState<File[]>([]);

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <div className='min-w-0'>
                <FileUpload.Root
                    value={files}
                    onChange={setFiles}
                    multiple
                    mimes={IMAGE_MIMES}
                    maxSize={IMAGE_MAX_SIZE}
                    ActionButton={
                        <SampleButton load={createSampleImages} onLoaded={setFiles}>
                            <IconPhotoPlus data-icon='inline-start' />
                            Muat gambar contoh
                        </SampleButton>
                    }
                />
            </div>
            <div className='grid min-w-0 content-start gap-2'>
                <span className='font-medium text-sm/4'>Dimensi file</span>
                {files.length > 0 ? (
                    <ul className='grid gap-2'>
                        {files.map((file) => (
                            <ImageFileDetails key={getFileKey(file)} file={file} />
                        ))}
                    </ul>
                ) : (
                    <p className='rounded-lg border border-dashed p-4 text-muted-foreground text-sm'>
                        Belum ada gambar. Muat gambar contoh atau pilih JPEG, PNG, atau WebP.
                    </p>
                )}
            </div>
        </div>
    );
};

export { ImageEditorFileUpload };
