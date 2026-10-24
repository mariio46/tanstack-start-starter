import * as React from 'react';

import { IconPaperclip, IconPhotoPlus } from '@tabler/icons-react';

import { FileUpload } from '@/components/custom/file-upload';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { IMAGE_MAX_SIZE } from './constants';
import { FileValue } from './file-value';
import { SampleButton } from './sample-button';
import { createSampleImages } from './samples';

const DialogFileUpload = () => {
    const [files, setFiles] = React.useState<File[]>([]);

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <div className='grid content-start gap-4'>
                <p className='text-muted-foreground text-sm'>
                    Buka dialog, muat gambar contoh atau pilih file, tutup dialog, lalu buka lagi. Thumbnail dan editor
                    tetap memakai file yang sama.
                </p>
                <Dialog>
                    <DialogTrigger render={<Button variant='outline' className='justify-self-start' />}>
                        <IconPaperclip data-icon='inline-start' />
                        {files.length > 0 ? `Ubah lampiran (${files.length})` : 'Tambah lampiran'}
                    </DialogTrigger>
                    <DialogContent className='max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl'>
                        <DialogHeader>
                            <DialogTitle>Lampiran</DialogTitle>
                            <DialogDescription>
                                File disimpan di state parent, jadi tetap ada setelah dialog ditutup.
                            </DialogDescription>
                        </DialogHeader>
                        <FileUpload.Root
                            value={files}
                            onChange={setFiles}
                            multiple
                            maxSize={IMAGE_MAX_SIZE}
                            ActionButton={
                                <SampleButton load={createSampleImages} onLoaded={setFiles}>
                                    <IconPhotoPlus data-icon='inline-start' />
                                    Muat gambar contoh
                                </SampleButton>
                            }
                        />
                        <DialogFooter>
                            <DialogClose render={<Button />}>Selesai</DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <FileValue files={files} label='State parent' />
        </div>
    );
};

export { DialogFileUpload };
