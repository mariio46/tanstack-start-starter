import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { IMAGE_ACCEPT, IMAGE_MAX_SIZE } from '@/components/rich-text-editor/constants';
import { useEditorConfig } from '@/components/rich-text-editor/editor-root';
import { INSERT_IMAGE_COMMAND } from '@/components/rich-text-editor/extensions/image';
import {
    getImageAltText,
    resolveImageSrc,
    validateImageFile,
} from '@/components/rich-text-editor/plugins/image-plugin';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { InputFile } from '@/components/ui/input-file';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ImageSource = 'upload' | 'url';

function isValidImageUrl(url: string) {
    if (url.startsWith('data:image/')) return true;

    try {
        const { protocol } = new URL(url);
        return protocol === 'http:' || protocol === 'https:';
    } catch {
        return false;
    }
}

function getErrorMessage(error: unknown) {
    return error instanceof Error && error.message ? error.message : 'Gagal mengupload gambar.';
}

function InsertImageDialog({ close }: { close: () => void }) {
    const [editor] = useLexicalComposerContext();
    const { uploadImage } = useEditorConfig();
    const id = React.useId();
    const [source, setSource] = React.useState<ImageSource>('upload');
    const [files, setFiles] = React.useState<File[]>([]);
    const [url, setUrl] = React.useState('');
    const [altText, setAltText] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    const [isPending, setIsPending] = React.useState(false);

    const file = files[0];
    const canSubmit = !isPending && (source === 'upload' ? file !== undefined : url.trim() !== '');

    const insert = (src: string, fallbackAltText: string) => {
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText: altText.trim() || fallbackAltText });
        close();
    };

    const submitUpload = async (file: File) => {
        const invalid = validateImageFile(file);
        if (invalid) {
            setError(invalid);
            return;
        }

        setIsPending(true);
        try {
            insert(await resolveImageSrc(file, uploadImage), getImageAltText(file));
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setIsPending(false);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!canSubmit) return;

        if (source === 'upload') {
            if (file) void submitUpload(file);
            return;
        }

        const src = url.trim();
        if (!isValidImageUrl(src)) {
            setError('Masukkan URL gambar yang valid, diawali http:// atau https://.');
            return;
        }

        insert(src, '');
    };

    return (
        <form onSubmit={handleSubmit} className='grid gap-4'>
            <DialogHeader>
                <DialogTitle>Sisipkan gambar</DialogTitle>
                <DialogDescription>Upload file atau tempel link gambar.</DialogDescription>
            </DialogHeader>
            <Tabs
                value={source}
                onValueChange={(value) => {
                    setSource(value as ImageSource);
                    setError(null);
                }}
            >
                <TabsList className='w-full'>
                    <TabsTrigger value='upload' disabled={isPending}>
                        Upload
                    </TabsTrigger>
                    <TabsTrigger value='url' disabled={isPending}>
                        URL
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='upload'>
                    <InputFile
                        accept={IMAGE_ACCEPT}
                        maxSize={IMAGE_MAX_SIZE}
                        value={files}
                        onValueChange={(next) => {
                            setFiles(next);
                            setError(null);
                        }}
                        disabled={isPending}
                        invalid={error !== null}
                        aria-label='File gambar'
                    />
                </TabsContent>
                <TabsContent value='url' className='grid gap-1.5'>
                    <Label htmlFor={`${id}-url`}>URL gambar</Label>
                    <Input
                        id={`${id}-url`}
                        type='url'
                        inputMode='url'
                        placeholder='https://example.com/image.png'
                        value={url}
                        aria-invalid={error !== null || undefined}
                        onChange={(event) => {
                            setUrl(event.currentTarget.value);
                            setError(null);
                        }}
                    />
                </TabsContent>
            </Tabs>
            <div className='grid gap-1.5'>
                <Label htmlFor={`${id}-alt`}>Teks alternatif</Label>
                <Input
                    id={`${id}-alt`}
                    placeholder={source === 'upload' ? 'Bawaan: nama file' : 'Jelaskan isi gambar'}
                    value={altText}
                    disabled={isPending}
                    onChange={(event) => setAltText(event.currentTarget.value)}
                />
            </div>
            {error && (
                <p role='alert' className='text-destructive text-sm'>
                    {error}
                </p>
            )}
            <DialogFooter>
                <DialogClose render={<Button type='button' variant='outline' />}>Batal</DialogClose>
                <Button type='submit' disabled={!canSubmit}>
                    {isPending && <Spinner />}
                    Sisipkan
                </Button>
            </DialogFooter>
        </form>
    );
}

export { InsertImageDialog };
