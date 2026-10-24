import { IconCrop, IconTrash, IconUpload, IconUser } from '@tabler/icons-react';

import { FileUpload, useFileUploadActions, useFileUploadState } from '@/components/custom/file-upload';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { IMAGE_MIMES, PHOTO_MAX_SIZE } from './constants';

const PhotoPreview = () => {
    const { items, isBusy, isEditing } = useFileUploadState();
    const { openFileDialog, openEditor, removeFile } = useFileUploadActions();

    const photo = items[0];
    const disabled = isBusy || isEditing;

    return (
        <div className='grid content-start gap-3'>
            <div className='relative aspect-square w-full overflow-hidden rounded-xl border bg-accent'>
                {photo?.tempUrl ? (
                    <img
                        src={photo.tempUrl}
                        alt={`Preview ${photo.name}`}
                        className='size-full object-cover object-center'
                    />
                ) : (
                    <div className='flex size-full items-center justify-center text-muted-foreground'>
                        <IconUser className='size-16' />
                    </div>
                )}
                {photo && (
                    <Badge variant='info' className='absolute top-2 right-2'>
                        Preview
                    </Badge>
                )}
            </div>
            <div className='flex flex-wrap gap-2'>
                <Button size='sm' variant='outline' onClick={openFileDialog} disabled={disabled}>
                    <IconUpload data-icon='inline-start' />
                    {photo ? 'Ganti' : 'Pilih foto'}
                </Button>
                <Button size='sm' variant='outline' onClick={() => openEditor(0)} disabled={!photo || disabled}>
                    <IconCrop data-icon='inline-start' />
                    Edit
                </Button>
                <Button size='sm' variant='destructive' onClick={() => removeFile(0)} disabled={!photo || disabled}>
                    <IconTrash data-icon='inline-start' />
                    Hapus
                </Button>
            </div>
        </div>
    );
};

const ComposableFileUpload = () => {
    return (
        <FileUpload.Root mimes={IMAGE_MIMES} maxSize={PHOTO_MAX_SIZE}>
            <div className='grid w-full gap-4 lg:grid-cols-3'>
                <PhotoPreview />
                <div className='grid min-w-0 content-start gap-4 lg:col-span-2'>
                    <FileUpload.Dropzone />
                    <FileUpload.Errors />
                    <FileUpload.List />
                </div>
                <FileUpload.EditorDialog />
                <FileUpload.ConfirmDialog />
            </div>
        </FileUpload.Root>
    );
};

export { ComposableFileUpload };
