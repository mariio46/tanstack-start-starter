import * as React from 'react';

import {
    IconFile,
    IconFileTypeDocx,
    IconFileTypeJs,
    IconFileTypePdf,
    IconFileTypePpt,
    IconFileTypeTxt,
    IconFileTypeXls,
    IconFileTypeZip,
    IconMovie,
    IconMusic,
    IconPhoto,
    IconUpload,
    IconX,
} from '@tabler/icons-react';

import { useControllableState } from '@/hooks/use-controllable-state';
import type { FileKind, FileRejection } from '@/lib/file';
import {
    describeAccept,
    formatFileSize,
    formatFileType,
    getFileKey,
    getFileKind,
    isImageFile,
    pickFiles,
} from '@/lib/file';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

const FILE_KIND_ICONS: Record<FileKind, React.ComponentType<{ className?: string }>> = {
    image: IconPhoto,
    video: IconMovie,
    audio: IconMusic,
    pdf: IconFileTypePdf,
    archive: IconFileTypeZip,
    spreadsheet: IconFileTypeXls,
    presentation: IconFileTypePpt,
    document: IconFileTypeDocx,
    text: IconFileTypeTxt,
    code: IconFileTypeJs,
    file: IconFile,
};

type InputFileOwnProps = {
    value?: File[];
    defaultValue?: File[];
    onValueChange?: (files: File[]) => void;
    onFilesRejected?: (rejections: FileRejection[]) => void;
    accept?: string;
    multiple?: boolean;
    minFiles?: number;
    maxFiles?: number;
    maxSize?: number;
    maxTotalSize?: number;
    invalid?: boolean;
    description?: React.ReactNode;
    className?: string;
    listClassName?: string;
};

type InputFileProps = Omit<
    React.ComponentProps<'input'>,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'size' | 'children'
> &
    InputFileOwnProps;

function buildHint({
    accept,
    multiple,
    minFiles,
    maxFiles,
    maxSize,
    maxTotalSize,
}: Pick<InputFileOwnProps, 'accept' | 'multiple' | 'minFiles' | 'maxFiles' | 'maxSize' | 'maxTotalSize'>) {
    const parts = [describeAccept(accept)];

    if (maxSize !== undefined) parts.push(`maks. ${formatFileSize(maxSize)} per file`);
    if (maxTotalSize !== undefined) parts.push(`total ${formatFileSize(maxTotalSize)}`);

    if (!multiple) {
        parts.push('satu file');
    } else {
        if (minFiles !== undefined) parts.push(`min. ${minFiles} file`);
        if (maxFiles !== undefined) parts.push(`maks. ${maxFiles} file`);
    }

    return parts.join(' · ');
}

function InputFilePreview({ file }: { file: File }) {
    const [url, setUrl] = React.useState<string | null>(null);
    const [failed, setFailed] = React.useState(false);

    React.useEffect(() => {
        if (!isImageFile(file)) return;

        const objectUrl = URL.createObjectURL(file);

        setUrl(objectUrl);
        setFailed(false);

        return () => {
            URL.revokeObjectURL(objectUrl);
            setUrl(null);
        };
    }, [file]);

    if (url && !failed) {
        return (
            <img
                src={url}
                alt={file.name}
                className='size-full object-cover'
                onError={() => setFailed(true)}
                data-slot='input-file-thumbnail'
            />
        );
    }

    const Icon = FILE_KIND_ICONS[getFileKind(file)];

    return <Icon className='size-4 text-muted-foreground' />;
}

interface InputFileItemProps extends Omit<React.ComponentProps<'li'>, 'children'> {
    file: File;
    disabled?: boolean;
    onRemove?: () => void;
}

function InputFileItem({ file, disabled, onRemove, className, ...props }: InputFileItemProps) {
    return (
        <li
            data-slot='input-file-item'
            className={cn(
                'flex items-center gap-3 rounded-lg border bg-background p-2 transition-colors dark:bg-input/30',
                className,
            )}
            {...props}
        >
            <div className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted'>
                <InputFilePreview file={file} />
            </div>
            <div className='grid min-w-0 flex-1 gap-0.5'>
                <span className='truncate font-medium text-sm/4' title={file.name}>
                    {file.name}
                </span>
                <span className='truncate text-muted-foreground text-xs'>
                    {formatFileSize(file.size)} · {formatFileType(file)}
                </span>
            </div>
            {onRemove && (
                <Button
                    variant='ghost'
                    size='icon-xs'
                    disabled={disabled}
                    onClick={onRemove}
                    aria-label={`Hapus ${file.name}`}
                >
                    <IconX />
                </Button>
            )}
        </li>
    );
}

function InputFile({
    value,
    defaultValue,
    onValueChange,
    onFilesRejected,
    accept,
    multiple = false,
    minFiles,
    maxFiles,
    maxSize,
    maxTotalSize,
    invalid,
    description,
    className,
    listClassName,
    disabled,
    id: idProp,
    ...props
}: InputFileProps) {
    const generatedId = React.useId();
    const id = idProp ?? generatedId;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const dragDepth = React.useRef(0);

    const [dragging, setDragging] = React.useState(false);
    const [rejections, setRejections] = React.useState<FileRejection[]>([]);

    const [files, setFiles] = useControllableState<File[]>({
        value,
        defaultValue: defaultValue ?? [],
        onChange: onValueChange,
    });

    React.useEffect(() => {
        const input = inputRef.current;

        if (!input) return;

        const transfer = new DataTransfer();

        for (const file of files) transfer.items.add(file);

        input.files = transfer.files;
    }, [files]);

    const constraints = { accept, multiple, maxFiles, maxSize, maxTotalSize };

    function handleIncoming(incoming: File[]) {
        if (incoming.length === 0) return;

        const result = pickFiles(files, incoming, constraints);

        setFiles(result.files);
        setRejections(result.rejections);

        if (result.rejections.length > 0) onFilesRejected?.(result.rejections);
    }

    function handleRemove(target: File) {
        const key = getFileKey(target);

        setFiles(files.filter((file) => getFileKey(file) !== key));
        setRejections([]);
    }

    function isFileDrag(event: React.DragEvent<HTMLLabelElement>) {
        return Array.from(event.dataTransfer.types).includes('Files');
    }

    function handleDragEnter(event: React.DragEvent<HTMLLabelElement>) {
        if (disabled || !isFileDrag(event)) return;

        event.preventDefault();
        dragDepth.current += 1;
        setDragging(true);
    }

    function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
        if (disabled || !isFileDrag(event)) return;

        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
        if (disabled) return;

        event.preventDefault();
        dragDepth.current = Math.max(0, dragDepth.current - 1);

        if (dragDepth.current === 0) setDragging(false);
    }

    function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
        if (disabled) return;

        event.preventDefault();
        dragDepth.current = 0;
        setDragging(false);

        handleIncoming(Array.from(event.dataTransfer.files));
    }

    const hint = description ?? buildHint({ accept, multiple, minFiles, maxFiles, maxSize, maxTotalSize });

    return (
        <div data-slot='input-file' className={cn('grid w-full gap-3', className)}>
            <label
                htmlFor={id}
                data-slot='input-file-trigger'
                data-dragging={dragging || undefined}
                data-disabled={disabled || undefined}
                aria-invalid={invalid || undefined}
                className={cn(
                    'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-input border-dashed bg-transparent px-4 py-6 text-center transition-colors',
                    'hover:border-ring/60 hover:bg-accent/50 dark:bg-input/30 dark:hover:bg-input/50',
                    'has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50',
                    'data-dragging:border-ring data-dragging:bg-accent',
                    'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
                    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
                )}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    id={id}
                    type='file'
                    className='sr-only'
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={(event) => handleIncoming(Array.from(event.target.files ?? []))}
                    {...props}
                />
                <IconUpload className='size-5 text-muted-foreground' />
                <span className='font-medium text-sm'>Klik untuk upload atau seret dan lepas</span>
                <span className='text-muted-foreground text-xs'>{hint}</span>
            </label>

            {files.length > 0 && (
                <ul data-slot='input-file-list' className={cn('flex flex-col gap-2', listClassName)}>
                    {files.map((file) => (
                        <InputFileItem
                            key={getFileKey(file)}
                            file={file}
                            disabled={disabled}
                            onRemove={() => handleRemove(file)}
                        />
                    ))}
                </ul>
            )}

            {rejections.length > 0 && (
                <ul data-slot='input-file-rejections' className='grid gap-1'>
                    {rejections.map((rejection) => (
                        <li
                            key={`${getFileKey(rejection.file)}:${rejection.reason}`}
                            className='text-destructive text-xs'
                        >
                            {rejection.message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export type { InputFileProps };
export { InputFile, InputFileItem };
