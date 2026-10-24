import * as React from 'react';

import {
    IconArchive,
    IconCrop,
    IconDragDrop,
    IconExclamationCircle,
    IconFile,
    IconFileDescription,
    IconFileSpreadsheet,
    IconFileText,
    IconFileTypeCsv,
    IconFileTypeDocx,
    IconFileTypePdf,
    IconFileTypeTxt,
    IconFileZip,
    IconPhoto,
    IconTrash,
    IconUpload,
} from '@tabler/icons-react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop, type PercentCrop } from 'react-image-crop';

import { formatFileSize, formatFileType } from '@/lib/file';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

import 'react-image-crop/dist/ReactCrop.css';

type FileUploadValue = File[];

type FileUploadError = {
    oversize?: boolean;
};

type FileUploadItem = {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    lastModified: number;
    tempUrl?: string;
    managedObjectUrl?: boolean;
    errors: FileUploadError;
};

type FileUploadProps = {
    value?: FileUploadValue;
    onChange?: (value: FileUploadValue) => void;
    multiple?: boolean;
    mimes?: string[];
    min?: number;
    max?: number;
    maxSize?: number;
    children?: React.ReactNode;
    ActionButton?: React.ReactNode;
};

type CropPreset = 'free' | 'original' | 'square' | 'landscape' | 'portrait';

type ResizePreset = {
    label: string;
    width: number;
    height: number;
};

type ImageDimensions = {
    width: number;
    height: number;
};

const MIN_DIMENSION = 100;
const MAX_DIMENSION = 5000;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const DEFAULT_ZOOM = 1;
const EDITABLE_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function createFileId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getFileSignature(file: File) {
    return `${file.name}-${file.size}-${file.type}-${file.lastModified}`;
}

function clampDimension(value: number) {
    return Math.min(MAX_DIMENSION, Math.max(MIN_DIMENSION, Math.round(value)));
}

function getExtension(name: string) {
    const idx = name.lastIndexOf('.');
    if (idx === -1) return '';
    return name.slice(idx + 1).toLowerCase();
}

function buildAccept(mimes: string[] | undefined) {
    if (!mimes?.length) return undefined;
    return mimes.join(',');
}

function isAllowedByMimes(file: File, mimes: string[] | undefined) {
    if (!mimes?.length) return true;
    const ext = `.${getExtension(file.name)}`;

    return mimes.some((rule) => {
        const trimmed = rule.trim();
        if (!trimmed) return false;
        if (trimmed.startsWith('.')) {
            return ext === trimmed.toLowerCase();
        }
        if (trimmed.endsWith('/*')) {
            const prefix = trimmed.slice(0, trimmed.length - 1);
            return Boolean(file.type) && file.type.startsWith(prefix);
        }
        return file.type === trimmed;
    });
}

function normalizeImageType(file: Pick<File, 'name' | 'type'>) {
    if (EDITABLE_IMAGE_TYPES.has(file.type)) {
        return file.type;
    }

    const name = file.name.toLowerCase();
    if (name.endsWith('.jpg') || name.endsWith('.jpeg')) {
        return 'image/jpeg';
    }
    if (name.endsWith('.png')) {
        return 'image/png';
    }
    if (name.endsWith('.webp')) {
        return 'image/webp';
    }

    return file.type;
}

function isEditableImageFile(file: Pick<File, 'name' | 'type'>) {
    return EDITABLE_IMAGE_TYPES.has(normalizeImageType(file));
}

function isPreviewableImageFile(file: Pick<File, 'name' | 'type'>) {
    const normalized = normalizeImageType(file);
    return normalized === 'image/jpeg' || normalized === 'image/png' || normalized === 'image/webp';
}

function disposeFileUploadItem(item: FileUploadItem | null | undefined) {
    if (item?.managedObjectUrl && item.tempUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(item.tempUrl);
    }
}

function disposeFileUploadItems(items: FileUploadItem[]) {
    items.forEach((item) => {
        disposeFileUploadItem(item);
    });
}

function centerAspectCropForImage(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 100,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

function getCropAspectRatio(preset: CropPreset, originalAspect: number) {
    switch (preset) {
        case 'original':
            return originalAspect;
        case 'square':
            return 1;
        case 'landscape':
            return 16 / 9;
        case 'portrait':
            return 3 / 4;
        case 'free':
            return undefined;
    }
}

function createDefaultCrop(mediaWidth: number, mediaHeight: number, aspect: number | undefined): PercentCrop {
    if (!aspect) {
        return {
            unit: '%',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
        };
    }

    return centerAspectCropForImage(mediaWidth, mediaHeight, aspect);
}

function percentCropToPixels(crop: PercentCrop | undefined, mediaWidth: number, mediaHeight: number): Crop {
    if (!crop) {
        return {
            unit: 'px',
            x: 0,
            y: 0,
            width: mediaWidth,
            height: mediaHeight,
        };
    }

    const x = Math.max(0, Math.round((crop.x / 100) * mediaWidth));
    const y = Math.max(0, Math.round((crop.y / 100) * mediaHeight));
    const width = Math.max(1, Math.round((crop.width / 100) * mediaWidth));
    const height = Math.max(1, Math.round((crop.height / 100) * mediaHeight));

    return {
        unit: 'px',
        x: Math.min(x, mediaWidth - 1),
        y: Math.min(y, mediaHeight - 1),
        width: Math.min(width, mediaWidth - x),
        height: Math.min(height, mediaHeight - y),
    };
}

function getResizeAspectRatio(sourceDimensions: ImageDimensions | null, crop: PercentCrop | undefined) {
    if (!sourceDimensions) {
        return 1;
    }

    const nextCrop = percentCropToPixels(crop, sourceDimensions.width, sourceDimensions.height);
    return nextCrop.width / nextCrop.height;
}

function getResizeReferenceDimensions(
    sourceDimensions: ImageDimensions | null,
    crop: PercentCrop | undefined,
): ImageDimensions {
    if (!sourceDimensions) {
        return {
            width: MIN_DIMENSION,
            height: MIN_DIMENSION,
        };
    }

    const nextCrop = percentCropToPixels(crop, sourceDimensions.width, sourceDimensions.height);
    return {
        width: clampDimension(nextCrop.width),
        height: clampDimension(nextCrop.height),
    };
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
    const quality = type === 'image/png' ? undefined : 0.98;

    return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Gagal mengekspor gambar hasil edit.'));
                    return;
                }

                resolve(blob);
            },
            type,
            quality,
        );
    });
}

async function loadImageBitmap(file: Blob) {
    if (typeof createImageBitmap !== 'function') {
        return null;
    }

    try {
        return await createImageBitmap(file, { imageOrientation: 'from-image' } as ImageBitmapOptions);
    } catch {
        try {
            return await createImageBitmap(file);
        } catch {
            return null;
        }
    }
}

async function processImageFile({
    image,
    crop,
    sourceDimensions,
    targetWidth,
    targetHeight,
}: {
    image: FileUploadItem;
    crop: PercentCrop | undefined;
    sourceDimensions: ImageDimensions;
    targetWidth: number;
    targetHeight: number;
}) {
    if (!image.tempUrl) {
        throw new Error('URL preview gambar tidak tersedia.');
    }

    const safeType = normalizeImageType(image.file);
    const sourceCrop = percentCropToPixels(crop, sourceDimensions.width, sourceDimensions.height);
    const bitmap = await loadImageBitmap(image.file);

    try {
        const canvas = document.createElement('canvas');
        canvas.width = clampDimension(targetWidth);
        canvas.height = clampDimension(targetHeight);

        const context = canvas.getContext('2d', { alpha: safeType !== 'image/jpeg' });
        if (!context) {
            throw new Error('Pemrosesan gambar tidak tersedia di browser ini.');
        }

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        const drawable =
            bitmap ??
            (await new Promise<HTMLImageElement>((resolve, reject) => {
                const element = new window.Image();
                element.onload = () => resolve(element);
                element.onerror = () => reject(new Error('Gagal membaca gambar sumber.'));
                element.src = image.tempUrl ?? '';
            }));

        context.drawImage(
            drawable,
            sourceCrop.x,
            sourceCrop.y,
            sourceCrop.width,
            sourceCrop.height,
            0,
            0,
            canvas.width,
            canvas.height,
        );

        return await canvasToBlob(canvas, safeType);
    } finally {
        bitmap?.close();
    }
}

function normalizeErrorMessage(error: unknown, fallbackMessage: string) {
    return error instanceof Error ? error.message : fallbackMessage;
}

type FileUploadState = {
    files: FileUploadValue;
    items: FileUploadItem[];
    multiple: boolean;
    mimes?: string[];
    min?: number;
    max: number;
    maxSize: number;
    accept?: string;
    isDragging: boolean;
    callbackError: string | null;
    minError: string | null;
    isEditing: boolean;
    activeEditingIndex: number | null;
    isProcessing: boolean;
    isBusy: boolean;
    editorError: string | null;
    editorCrop?: PercentCrop;
    sourceDimensions: ImageDimensions | null;
    editorImageRef: React.RefObject<HTMLImageElement | null>;
    previewUrl: string;
    previewLoading: boolean;
    cropPreset: CropPreset;
    keepCropAspect: boolean;
    keepResizeAspect: boolean;
    zoom: number;
    resizeWidth: number;
    resizeHeight: number;
    resizePresets: ResizePreset[];
    previewDetails: { cropWidth: number; cropHeight: number; outputWidth: number; outputHeight: number } | null;
    confirmOpen: boolean;
};

type FileUploadActions = {
    openFileDialog: () => void;
    removeFile: (index: number) => void;
    clearFiles: () => void;
    openEditor: (index: number) => void;
    closeEditor: () => void;
    setEditorCrop: (crop: PercentCrop | undefined) => void;
    onEditorImageLoad: (event: React.SyntheticEvent<HTMLImageElement>) => void;
    setConfirmOpen: (open: boolean) => void;
    applyEditedImage: () => void;
    resetEditor: () => void;
    setZoom: (next: number) => void;
    setKeepCropAspect: (next: boolean) => void;
    setKeepResizeAspect: (next: boolean) => void;
    applyCropPreset: (preset: CropPreset) => void;
    applyResizePreset: (preset: ResizePreset) => void;
    handleResizeInputChange: (dimension: 'width' | 'height', value: string) => void;
    handleDragEnter: (event: React.DragEvent) => void;
    handleDragLeave: (event: React.DragEvent) => void;
    handleDragOver: (event: React.DragEvent) => void;
    handleDrop: (event: React.DragEvent) => void;
};

const FileUploadStateContext = React.createContext<FileUploadState | null>(null);
const FileUploadActionsContext = React.createContext<FileUploadActions | null>(null);

function useFileUploadState() {
    const context = React.useContext(FileUploadStateContext);
    if (!context) {
        throw new Error('useFileUploadState must be used within FileUpload.Root');
    }
    return context;
}

function useFileUploadActions() {
    const context = React.useContext(FileUploadActionsContext);
    if (!context) {
        throw new Error('useFileUploadActions must be used within FileUpload.Root');
    }
    return context;
}

function getIconFromFileType(item: Pick<FileUploadItem, 'file' | 'name' | 'type'>) {
    if (isPreviewableImageFile(item.file)) {
        return IconPhoto;
    }

    const ext = getExtension(item.name);
    if (ext === 'pdf') return IconFileTypePdf;
    if (ext === 'csv') return IconFileTypeCsv;
    if (ext === 'xls' || ext === 'xlsx') return IconFileSpreadsheet;
    if (ext === 'doc' || ext === 'docx') return IconFileTypeDocx;
    if (ext === 'txt') return IconFileTypeTxt;
    if (ext === 'zip' || ext === 'rar' || ext === '7z') return IconFileZip;
    if (ext === 'tar' || ext === 'gz') return IconArchive;

    if (item.type.startsWith('text/')) return IconFileText;

    return IconFile;
}

function FileUploadRoot({
    value,
    onChange,
    multiple = false,
    mimes,
    min,
    max = 10,
    maxSize = 1048576,
    children,
    ActionButton,
}: FileUploadProps) {
    'use no memo';

    const isControlled = value !== undefined;
    const [internalFiles, setInternalFiles] = React.useState<FileUploadValue>([]);
    const [callbackError, setCallbackError] = React.useState<string | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    const [activeEditingIndex, setActiveEditingIndex] = React.useState<number | null>(null);
    const [editorError, setEditorError] = React.useState<string | null>(null);
    const [sourceDimensions, setSourceDimensions] = React.useState<ImageDimensions | null>(null);
    const [cropPreset, setCropPreset] = React.useState<CropPreset>('original');
    const [keepCropAspect, setKeepCropAspect] = React.useState(true);
    const [keepResizeAspect, setKeepResizeAspect] = React.useState(true);
    const [editorCrop, setEditorCrop] = React.useState<PercentCrop>();
    const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);
    const [resizeWidth, setResizeWidth] = React.useState(MIN_DIMENSION);
    const [resizeHeight, setResizeHeight] = React.useState(MIN_DIMENSION);
    const [resizeTouched, setResizeTouched] = React.useState(false);
    const [previewUrl, setPreviewUrl] = React.useState('');
    const [previewLoading, setPreviewLoading] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [confirmOpen, setConfirmOpen] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const editorImageRef = React.useRef<HTMLImageElement>(null);
    const previewUrlRef = React.useRef('');
    const internalFilesRef = React.useRef<FileUploadValue>([]);
    const itemCacheRef = React.useRef<Map<string, FileUploadItem>>(new Map());
    const itemsRef = React.useRef<FileUploadItem[]>([]);

    const files = isControlled ? (value ?? []) : internalFiles;
    const accept = React.useMemo(() => buildAccept(mimes), [mimes]);

    const items = React.useMemo(() => {
        const nextSignatures = new Set<string>();
        const nextItems: FileUploadItem[] = files.map((file) => {
            const signature = getFileSignature(file);
            nextSignatures.add(signature);

            const cached = itemCacheRef.current.get(signature);
            if (cached) {
                cached.file = file;
                cached.name = file.name;
                cached.size = file.size;
                cached.type = file.type;
                cached.lastModified = file.lastModified;
                cached.errors.oversize = file.size > maxSize;
                if (!cached.tempUrl && isPreviewableImageFile(file)) {
                    cached.tempUrl = URL.createObjectURL(file);
                    cached.managedObjectUrl = true;
                }
                return cached;
            }

            const tempUrl = isPreviewableImageFile(file) ? URL.createObjectURL(file) : undefined;
            const nextItem: FileUploadItem = {
                id: createFileId(),
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                tempUrl,
                managedObjectUrl: Boolean(tempUrl),
                errors: { oversize: file.size > maxSize },
            };
            itemCacheRef.current.set(signature, nextItem);
            return nextItem;
        });

        itemCacheRef.current.forEach((item, signature) => {
            if (nextSignatures.has(signature)) {
                return;
            }
            itemCacheRef.current.delete(signature);
            disposeFileUploadItem(item);
        });

        itemsRef.current = nextItems;
        return nextItems;
    }, [files, maxSize]);

    const activeEditingItem = activeEditingIndex !== null ? (items[activeEditingIndex] ?? null) : null;
    const isEditing = activeEditingIndex !== null;
    const isBusy = isProcessing;
    const minError = min && files.length < min ? `Minimal upload ${min} file.` : null;

    const resizePresets = React.useMemo<ResizePreset[]>(() => {
        const original = sourceDimensions
            ? {
                  label: 'Asli',
                  width: clampDimension(sourceDimensions.width),
                  height: clampDimension(sourceDimensions.height),
              }
            : {
                  label: 'Asli',
                  width: MIN_DIMENSION,
                  height: MIN_DIMENSION,
              };

        return [
            original,
            { label: 'Persegi 512', width: 512, height: 512 },
            { label: 'Persegi 1024', width: 1024, height: 1024 },
            { label: 'Potret 1080', width: 1080, height: 1350 },
            { label: 'Banner 1200', width: 1200, height: 630 },
        ];
    }, [sourceDimensions]);

    const cleanupPreviewUrl = React.useCallback(() => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = '';
        }

        setPreviewUrl('');
    }, []);

    const updatePreviewUrl = React.useCallback((blob: Blob) => {
        const nextUrl = URL.createObjectURL(blob);
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        previewUrlRef.current = nextUrl;
        setPreviewUrl(nextUrl);
    }, []);

    const emitChange = React.useCallback(
        (nextFiles: FileUploadValue) => {
            if (!isControlled) {
                setInternalFiles(nextFiles);
            }
            onChange?.(nextFiles);
        },
        [isControlled, onChange],
    );

    React.useEffect(() => {
        internalFilesRef.current = internalFiles;
    }, [internalFiles]);

    React.useEffect(() => {
        return () => {
            cleanupPreviewUrl();
            disposeFileUploadItems(itemsRef.current);
            itemCacheRef.current.clear();
        };
    }, [cleanupPreviewUrl]);

    React.useEffect(() => {
        if (activeEditingIndex !== null && !items[activeEditingIndex]) {
            setActiveEditingIndex(null);
        }
    }, [activeEditingIndex, items]);

    const closeEditor = React.useCallback(() => {
        setActiveEditingIndex(null);
        setEditorError(null);
        setSourceDimensions(null);
        setCropPreset('original');
        setKeepCropAspect(true);
        setKeepResizeAspect(true);
        setEditorCrop(undefined);
        setZoom(DEFAULT_ZOOM);
        setResizeWidth(MIN_DIMENSION);
        setResizeHeight(MIN_DIMENSION);
        setResizeTouched(false);
        setPreviewLoading(false);
        setIsProcessing(false);
        setConfirmOpen(false);
        cleanupPreviewUrl();
    }, [cleanupPreviewUrl]);

    const syncResizeFromCrop = React.useCallback(
        (nextSourceDimensions: ImageDimensions | null, nextCrop: PercentCrop | undefined) => {
            if (resizeTouched) {
                return;
            }

            const nextSize = getResizeReferenceDimensions(nextSourceDimensions, nextCrop);
            setResizeWidth(nextSize.width);
            setResizeHeight(nextSize.height);
        },
        [resizeTouched],
    );

    React.useEffect(() => {
        syncResizeFromCrop(sourceDimensions, editorCrop);
    }, [editorCrop, sourceDimensions, syncResizeFromCrop]);

    React.useEffect(() => {
        if (!activeEditingItem || !sourceDimensions || !isEditableImageFile(activeEditingItem.file)) {
            return;
        }

        let cancelled = false;
        const timeoutId = window.setTimeout(async () => {
            setPreviewLoading(true);

            try {
                const previewBlob = await processImageFile({
                    image: activeEditingItem,
                    crop: editorCrop,
                    sourceDimensions,
                    targetWidth: resizeWidth,
                    targetHeight: resizeHeight,
                });

                if (cancelled) {
                    return;
                }

                setEditorError(null);
                updatePreviewUrl(previewBlob);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                cleanupPreviewUrl();
                setEditorError(normalizeErrorMessage(error, 'Gagal membuat preview gambar.'));
            } finally {
                if (!cancelled) {
                    setPreviewLoading(false);
                }
            }
        }, 120);

        return () => {
            cancelled = true;
            window.clearTimeout(timeoutId);
        };
    }, [
        activeEditingItem,
        cleanupPreviewUrl,
        editorCrop,
        resizeHeight,
        resizeWidth,
        sourceDimensions,
        updatePreviewUrl,
    ]);

    React.useEffect(() => {
        if (!isEditing) {
            return;
        }

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                event.preventDefault();
                if (confirmOpen) {
                    setConfirmOpen(false);
                    return;
                }

                if (!isBusy) {
                    closeEditor();
                }
            }

            if (event.key === 'Enter' && !event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey) {
                const target = event.target;
                if (target instanceof HTMLTextAreaElement) {
                    return;
                }

                if (!isBusy && !previewLoading && previewUrl && !editorError) {
                    event.preventDefault();
                    setConfirmOpen(true);
                }
            }
        }

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [closeEditor, confirmOpen, editorError, isBusy, isEditing, previewLoading, previewUrl]);

    const resetInput = React.useCallback(() => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, []);

    const openFileDialog = React.useCallback(() => {
        if (!isEditing && !isBusy) {
            inputRef.current?.click();
        }
    }, [isBusy, isEditing]);

    const updateResizeDimensions = React.useCallback((nextWidth: number, nextHeight: number) => {
        setResizeTouched(true);
        setResizeWidth(clampDimension(nextWidth));
        setResizeHeight(clampDimension(nextHeight));
    }, []);

    const applyResizePreset = React.useCallback(
        (preset: ResizePreset) => {
            const aspect = getResizeAspectRatio(sourceDimensions, editorCrop);

            if (keepResizeAspect && aspect > 0) {
                let width = clampDimension(preset.width);
                let height = clampDimension(width / aspect);

                if (height > preset.height) {
                    height = clampDimension(preset.height);
                    width = clampDimension(height * aspect);
                }

                updateResizeDimensions(width, height);
                return;
            }

            updateResizeDimensions(preset.width, preset.height);
        },
        [editorCrop, keepResizeAspect, sourceDimensions, updateResizeDimensions],
    );

    const handleResizeInputChange = React.useCallback(
        (dimension: 'width' | 'height', value: string) => {
            const nextValue = Number(value);
            if (!Number.isFinite(nextValue)) {
                return;
            }

            const safeValue = clampDimension(nextValue);
            const aspect = getResizeAspectRatio(sourceDimensions, editorCrop);

            if (keepResizeAspect && aspect > 0) {
                if (dimension === 'width') {
                    updateResizeDimensions(safeValue, clampDimension(safeValue / aspect));
                } else {
                    updateResizeDimensions(clampDimension(safeValue * aspect), safeValue);
                }
                return;
            }

            if (dimension === 'width') {
                updateResizeDimensions(safeValue, resizeHeight);
            } else {
                updateResizeDimensions(resizeWidth, safeValue);
            }
        },
        [editorCrop, keepResizeAspect, resizeHeight, resizeWidth, sourceDimensions, updateResizeDimensions],
    );

    const applyCropPreset = React.useCallback(
        (preset: CropPreset) => {
            setCropPreset(preset);

            const imageElement = editorImageRef.current;
            if (!imageElement || !sourceDimensions) {
                return;
            }

            const originalAspect = sourceDimensions.width / sourceDimensions.height;
            const nextAspect = getCropAspectRatio(preset, originalAspect);
            setKeepCropAspect(nextAspect !== undefined);
            setEditorCrop(
                createDefaultCrop(
                    imageElement.width || sourceDimensions.width,
                    imageElement.height || sourceDimensions.height,
                    nextAspect,
                ),
            );
        },
        [sourceDimensions],
    );

    const openEditor = React.useCallback(
        (index: number) => {
            const item = items[index];
            if (!item || isBusy) {
                return;
            }

            cleanupPreviewUrl();
            setCallbackError(null);
            setActiveEditingIndex(index);
            setEditorError(
                isEditableImageFile(item.file) ? null : 'Edit hanya tersedia untuk JPEG, JPG, PNG, dan WebP.',
            );
            setSourceDimensions(null);
            setCropPreset('original');
            setKeepCropAspect(true);
            setKeepResizeAspect(true);
            setEditorCrop(undefined);
            setZoom(DEFAULT_ZOOM);
            setResizeWidth(MIN_DIMENSION);
            setResizeHeight(MIN_DIMENSION);
            setResizeTouched(false);
            setPreviewLoading(false);
            setConfirmOpen(false);
        },
        [cleanupPreviewUrl, isBusy, items],
    );

    const resetEditor = React.useCallback(() => {
        if (activeEditingIndex !== null) {
            openEditor(activeEditingIndex);
        }
    }, [activeEditingIndex, openEditor]);

    const onEditorImageLoad = React.useCallback(
        (event: React.SyntheticEvent<HTMLImageElement>) => {
            const naturalWidth = event.currentTarget.naturalWidth;
            const naturalHeight = event.currentTarget.naturalHeight;
            const displayWidth = event.currentTarget.width || naturalWidth;
            const displayHeight = event.currentTarget.height || naturalHeight;
            const nextSourceDimensions = {
                width: naturalWidth,
                height: naturalHeight,
            };
            const aspect = naturalWidth / naturalHeight;

            setSourceDimensions(nextSourceDimensions);
            setEditorCrop(createDefaultCrop(displayWidth, displayHeight, aspect));
            setResizeWidth(clampDimension(naturalWidth));
            setResizeHeight(clampDimension(naturalHeight));
            setResizeTouched(false);
            setEditorError(activeEditingItem && isEditableImageFile(activeEditingItem.file) ? null : editorError);
        },
        [activeEditingItem, editorError],
    );

    const setFilesFromSelection = React.useCallback(
        (nextSelectedFiles: File[]) => {
            setCallbackError(null);

            const validByMime = nextSelectedFiles.filter((file) => isAllowedByMimes(file, mimes));
            const invalidByMime = nextSelectedFiles.filter((file) => !isAllowedByMimes(file, mimes));

            const current = files;
            let next: FileUploadValue = current;
            let accepted: FileUploadValue = [];
            let skippedCount = 0;

            if (!validByMime.length) {
                if (invalidByMime.length) {
                    setCallbackError('Beberapa file dilewati karena format tidak sesuai.');
                }
                return;
            }

            if (multiple) {
                const remaining = Math.max(0, max - current.length);
                accepted = validByMime.slice(0, remaining);
                skippedCount = validByMime.length - accepted.length;
                next = accepted.length ? [...current, ...accepted] : current;
            } else {
                accepted = validByMime.slice(0, 1);
                skippedCount = validByMime.length - accepted.length;
                next = accepted.length ? accepted : current;
            }

            const errors: string[] = [];
            if (invalidByMime.length) errors.push('format tidak sesuai');
            if (skippedCount > 0) errors.push('melebihi batas jumlah file');
            if (errors.length) {
                setCallbackError(`Beberapa file dilewati karena ${errors.join(' dan ')}.`);
            }

            if (next !== current) {
                emitChange(next);
            }
        },
        [emitChange, files, max, mimes, multiple],
    );

    const handleInputChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (isEditing || isBusy) {
                return;
            }

            const selected = event.target.files ? Array.from(event.target.files) : [];
            if (!selected.length) {
                return;
            }

            setFilesFromSelection(selected);
            resetInput();
        },
        [isBusy, isEditing, resetInput, setFilesFromSelection],
    );

    const removeFile = React.useCallback(
        (index: number) => {
            if (isBusy) {
                return;
            }

            const next = files.filter((_, i) => i !== index);
            emitChange(next);
        },
        [emitChange, files, isBusy],
    );

    const clearFiles = React.useCallback(() => {
        if (isEditing || isBusy || !files.length) {
            return;
        }

        emitChange([]);
        resetInput();
    }, [emitChange, files.length, isBusy, isEditing, resetInput]);

    const applyEditedImage = React.useCallback(async () => {
        if (activeEditingIndex === null || !activeEditingItem || !sourceDimensions || isBusy) {
            return;
        }

        setIsProcessing(true);
        setCallbackError(null);

        try {
            const processedBlob = await processImageFile({
                image: activeEditingItem,
                crop: editorCrop,
                sourceDimensions,
                targetWidth: resizeWidth,
                targetHeight: resizeHeight,
            });

            const normalizedType = normalizeImageType(activeEditingItem.file);
            const processedFile = new File([processedBlob], activeEditingItem.name, {
                type: normalizedType,
                lastModified: Date.now(),
            });

            const nextFiles = [...files];
            nextFiles[activeEditingIndex] = processedFile;
            emitChange(nextFiles);
            closeEditor();
        } catch (error) {
            setEditorError(normalizeErrorMessage(error, 'Gagal menerapkan perubahan gambar.'));
        } finally {
            setIsProcessing(false);
            setConfirmOpen(false);
        }
    }, [
        activeEditingIndex,
        activeEditingItem,
        closeEditor,
        editorCrop,
        emitChange,
        files,
        isBusy,
        resizeHeight,
        resizeWidth,
        sourceDimensions,
    ]);

    const handleDragEnter = React.useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (!isEditing && !isBusy) {
                setIsDragging(true);
            }
        },
        [isBusy, isEditing],
    );

    const handleDragLeave = React.useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsDragging(false);
        }
    }, []);

    const handleDragOver = React.useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            event.stopPropagation();
            if (!isEditing && !isBusy) {
                setIsDragging(true);
            }
        },
        [isBusy, isEditing],
    );

    const handleDrop = React.useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            event.stopPropagation();
            setIsDragging(false);

            if (isEditing || isBusy) {
                return;
            }

            const dropped = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
            if (!dropped.length) {
                return;
            }

            setFilesFromSelection(dropped);
        },
        [isBusy, isEditing, setFilesFromSelection],
    );

    const previewDetails = React.useMemo(() => {
        if (!sourceDimensions) return null;
        const cropDimensions = getResizeReferenceDimensions(sourceDimensions, editorCrop);
        return {
            cropWidth: cropDimensions.width,
            cropHeight: cropDimensions.height,
            outputWidth: resizeWidth,
            outputHeight: resizeHeight,
        };
    }, [editorCrop, resizeHeight, resizeWidth, sourceDimensions]);

    const stateValue = React.useMemo<FileUploadState>(
        () => ({
            files,
            items,
            multiple,
            mimes,
            min,
            max,
            maxSize,
            accept,
            isDragging,
            callbackError,
            minError,
            isEditing,
            activeEditingIndex,
            isProcessing,
            isBusy,
            editorError,
            editorCrop,
            sourceDimensions,
            editorImageRef,
            previewUrl,
            previewLoading,
            cropPreset,
            keepCropAspect,
            keepResizeAspect,
            zoom,
            resizeWidth,
            resizeHeight,
            resizePresets,
            previewDetails,
            confirmOpen,
        }),
        [
            accept,
            activeEditingIndex,
            callbackError,
            confirmOpen,
            cropPreset,
            editorError,
            editorCrop,
            files,
            isBusy,
            isDragging,
            isEditing,
            isProcessing,
            items,
            keepCropAspect,
            keepResizeAspect,
            max,
            maxSize,
            min,
            minError,
            mimes,
            multiple,
            previewDetails,
            previewLoading,
            previewUrl,
            resizeHeight,
            resizePresets,
            resizeWidth,
            sourceDimensions,
            zoom,
        ],
    );

    const actionsValue = React.useMemo<FileUploadActions>(
        () => ({
            openFileDialog,
            removeFile,
            clearFiles,
            openEditor,
            closeEditor,
            setEditorCrop,
            onEditorImageLoad,
            setConfirmOpen,
            applyEditedImage,
            resetEditor,
            setZoom: (next) => setZoom(next),
            setKeepCropAspect: (next) => setKeepCropAspect(next),
            setKeepResizeAspect: (next) => setKeepResizeAspect(next),
            applyCropPreset,
            applyResizePreset,
            handleResizeInputChange,
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
        }),
        [
            applyEditedImage,
            applyCropPreset,
            applyResizePreset,
            closeEditor,
            clearFiles,
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            handleResizeInputChange,
            onEditorImageLoad,
            openFileDialog,
            openEditor,
            removeFile,
            resetEditor,
        ],
    );

    return (
        <FileUploadStateContext.Provider value={stateValue}>
            <FileUploadActionsContext.Provider value={actionsValue}>
                <Input
                    type='file'
                    accept={accept}
                    className='hidden'
                    multiple={multiple && !isEditing}
                    disabled={isEditing || isBusy}
                    onChange={handleInputChange}
                    ref={inputRef}
                />
                {children ?? <FileUploadLayout ActionButton={ActionButton} />}
            </FileUploadActionsContext.Provider>
        </FileUploadStateContext.Provider>
    );
}

function FileUploadLayout({ ActionButton }: { ActionButton?: React.ReactNode }) {
    return (
        <div className='grid w-full gap-4'>
            <FileUploadDropzone ActionButton={ActionButton} />
            <FileUploadErrors />
            <FileUploadList />
            <FileUploadEditorDialog />
            <FileUploadConfirmDialog />
        </div>
    );
}

function FileUploadDropzone({ ActionButton }: { ActionButton?: React.ReactNode }) {
    const { items, isDragging, isBusy, isEditing } = useFileUploadState();
    const { openFileDialog, clearFiles, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } =
        useFileUploadActions();

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <Empty
                data-dragging={isDragging}
                className='rounded-xl border border-dashed bg-accent transition-colors data-[dragging=true]:border-primary/60 data-[dragging=true]:bg-primary/5'
            >
                <EmptyHeader>
                    <EmptyMedia variant='icon'>{isDragging ? <IconDragDrop /> : <IconUpload />}</EmptyMedia>
                    <EmptyTitle>{isDragging ? 'Lepaskan di sini' : 'Upload File'}</EmptyTitle>
                    <EmptyDescription>Drag & drop file ke area ini atau klik tombol Pilih File.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <div className='flex flex-wrap gap-2'>
                        {ActionButton}
                        <Button size='sm' variant='outline' onClick={openFileDialog} disabled={isEditing || isBusy}>
                            <IconUpload data-icon='inline-start' />
                            Pilih File
                        </Button>
                        {!!items.length && (
                            <Button variant='destructive' size='sm' onClick={clearFiles} disabled={isEditing || isBusy}>
                                <IconTrash data-icon='inline-start' />
                                Hapus Semua
                            </Button>
                        )}
                    </div>
                </EmptyContent>
            </Empty>
        </div>
    );
}

function FileUploadErrors() {
    const { callbackError, minError } = useFileUploadState();

    if (!callbackError && !minError) {
        return null;
    }

    return (
        <Alert variant='destructive'>
            <IconExclamationCircle />
            <AlertTitle>Perhatian</AlertTitle>
            <AlertDescription>
                {callbackError && <p className='text-sm'>{callbackError}</p>}
                {minError && <p className='text-sm'>{minError}</p>}
            </AlertDescription>
        </Alert>
    );
}

const FileUploadRow = React.memo(function FileUploadRow({ item, index }: { item: FileUploadItem; index: number }) {
    const { maxSize, isBusy, isEditing } = useFileUploadState();
    const { removeFile, openEditor } = useFileUploadActions();

    const oversize = Boolean(item.errors.oversize);
    const Icon = getIconFromFileType(item);
    const canEdit = isEditableImageFile(item.file);

    return (
        <Item
            key={item.id}
            variant='outline'
            role='listitem'
            aria-invalid={oversize}
            className='bg-background aria-invalid:border-destructive/50 aria-invalid:border-dashed'
        >
            <ItemMedia variant='image'>
                {isPreviewableImageFile(item.file) && item.tempUrl ? (
                    <img src={item.tempUrl} alt={item.name} className='object-cover object-center' />
                ) : (
                    <div className='flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground'>
                        <Icon className='size-4' />
                    </div>
                )}
            </ItemMedia>
            <ItemContent>
                <ItemTitle className='line-clamp-1'>
                    {item.name} - <span className='text-muted-foreground'>{formatFileType(item)}</span>
                </ItemTitle>
                <ItemDescription>
                    {formatFileSize(item.size)} · {new Date(item.lastModified).toLocaleTimeString('id-ID')}
                    {oversize && (
                        <span className='text-destructive'>{` · Ukuran melebihi (${formatFileSize(maxSize)}).`}</span>
                    )}
                </ItemDescription>
            </ItemContent>
            <ItemContent className='flex-none'>
                <div className='flex items-center gap-2'>
                    {canEdit && (
                        <Button
                            variant='outline'
                            size='icon-sm'
                            aria-label='Edit gambar'
                            onClick={() => openEditor(index)}
                            disabled={isEditing || isBusy}
                        >
                            <IconCrop />
                        </Button>
                    )}
                    <Button
                        variant='destructive'
                        size='icon-sm'
                        aria-label='Hapus'
                        onClick={() => removeFile(index)}
                        disabled={isEditing || isBusy}
                    >
                        <IconTrash />
                    </Button>
                </div>
            </ItemContent>
        </Item>
    );
});

function FileUploadList() {
    const { items } = useFileUploadState();

    return (
        <div className='rounded-xl border border-dashed bg-accent p-2'>
            <ItemGroup className='gap-2'>
                {items.length > 0 ? (
                    items.map((item, index) => <FileUploadRow key={item.id} item={item} index={index} />)
                ) : (
                    <Item variant='outline' role='listitem' className='border-dashed bg-background'>
                        <ItemMedia variant='image'>
                            <div className='flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground'>
                                <IconFileDescription className='size-4' />
                            </div>
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle className='line-clamp-1 text-muted-foreground'>Belum ada file dipilih</ItemTitle>
                        </ItemContent>
                    </Item>
                )}
            </ItemGroup>
        </div>
    );
}

function FileUploadEditorDialog() {
    const {
        activeEditingIndex,
        items,
        isBusy,
        editorError,
        editorCrop,
        sourceDimensions,
        editorImageRef,
        cropPreset,
        keepCropAspect,
        keepResizeAspect,
        zoom,
        resizeWidth,
        resizeHeight,
        resizePresets,
        previewDetails,
        previewUrl,
        previewLoading,
        confirmOpen,
    } = useFileUploadState();
    const {
        closeEditor,
        resetEditor,
        setZoom,
        setKeepCropAspect,
        setKeepResizeAspect,
        applyCropPreset,
        applyResizePreset,
        handleResizeInputChange,
        setConfirmOpen,
        setEditorCrop,
        onEditorImageLoad,
    } = useFileUploadActions();

    const activeEditingItem = activeEditingIndex !== null ? (items[activeEditingIndex] ?? null) : null;
    const isEditing = activeEditingIndex !== null;

    return (
        <Dialog open={isEditing} onOpenChange={(open) => !open && !isBusy && closeEditor()}>
            <DialogContent className='sm:max-w-6xl' showCloseButton={!isBusy}>
                <DialogHeader>
                    <DialogTitle>Edit Gambar</DialogTitle>
                    <DialogDescription>
                        Crop dan resize satu gambar. Enter untuk menyimpan, Escape untuk membatalkan.
                    </DialogDescription>
                </DialogHeader>
                <div className='max-h-[70vh] overflow-y-auto'>
                    {activeEditingItem && (
                        <div className='grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]'>
                            <div className='grid gap-4'>
                                <div className='rounded-xl border bg-accent/40 p-3'>
                                    <div className='mb-3 flex flex-wrap items-center justify-between gap-3'>
                                        <div>
                                            <p className='text-sm font-medium'>{activeEditingItem.name}</p>
                                            <p className='text-muted-foreground text-sm'>
                                                {activeEditingItem.type} · {formatFileSize(activeEditingItem.size)}
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                onClick={() =>
                                                    setZoom(Math.max(MIN_ZOOM, Number((zoom - 0.1).toFixed(2))))
                                                }
                                                disabled={zoom <= MIN_ZOOM || isBusy}
                                            >
                                                Zoom Out
                                            </Button>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                onClick={() =>
                                                    setZoom(Math.min(MAX_ZOOM, Number((zoom + 0.1).toFixed(2))))
                                                }
                                                disabled={zoom >= MAX_ZOOM || isBusy}
                                            >
                                                Zoom In
                                            </Button>
                                        </div>
                                    </div>
                                    <div className='mb-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center'>
                                        <div className='grid gap-2'>
                                            <div className='flex items-center justify-between gap-3'>
                                                <span className='text-sm font-medium'>Zoom</span>
                                                <span className='text-muted-foreground text-sm'>
                                                    {zoom.toFixed(1)}x
                                                </span>
                                            </div>
                                            <Slider
                                                min={MIN_ZOOM}
                                                max={MAX_ZOOM}
                                                step={0.1}
                                                value={[zoom]}
                                                onValueChange={(sliderValue) =>
                                                    setZoom(Array.isArray(sliderValue) ? sliderValue[0] : sliderValue)
                                                }
                                                disabled={isBusy}
                                            />
                                        </div>
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() => setZoom(DEFAULT_ZOOM)}
                                            disabled={isBusy}
                                        >
                                            Reset Zoom
                                        </Button>
                                    </div>
                                    <div className='overflow-auto rounded-lg border bg-background p-4'>
                                        {editorError ? (
                                            <div className='text-destructive text-sm'>{editorError}</div>
                                        ) : (
                                            <ReactCrop
                                                crop={editorCrop}
                                                onChange={(_, percentCrop) => setEditorCrop(percentCrop)}
                                                aspect={
                                                    keepCropAspect && sourceDimensions
                                                        ? getCropAspectRatio(
                                                              cropPreset,
                                                              sourceDimensions.width / sourceDimensions.height,
                                                          )
                                                        : undefined
                                                }
                                                minWidth={20}
                                                minHeight={20}
                                                keepSelection={true}
                                                ruleOfThirds={true}
                                            >
                                                <img
                                                    ref={editorImageRef}
                                                    src={activeEditingItem.tempUrl}
                                                    alt={activeEditingItem.name}
                                                    onLoad={onEditorImageLoad}
                                                    className='max-h-[60vh] object-contain'
                                                    style={{
                                                        width: `${zoom * 100}%`,
                                                        maxWidth: 'none',
                                                    }}
                                                />
                                            </ReactCrop>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='grid gap-4'>
                                <div className='rounded-xl border bg-accent/40 p-4'>
                                    <div className='mb-4 flex items-center justify-between gap-3'>
                                        <div>
                                            <p className='font-medium'>Pengaturan Crop</p>
                                            <p className='text-muted-foreground text-sm'>
                                                Atur handle crop dan rasio aspek.
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-sm'>Kunci Rasio</span>
                                            <Switch
                                                checked={keepCropAspect}
                                                onCheckedChange={(checked) => {
                                                    const nextChecked = Boolean(checked);
                                                    setKeepCropAspect(nextChecked);
                                                    if (!nextChecked) {
                                                        applyCropPreset('free');
                                                        return;
                                                    }
                                                    applyCropPreset(cropPreset === 'free' ? 'original' : cropPreset);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-wrap gap-2'>
                                        {(['original', 'square', 'landscape', 'portrait', 'free'] as CropPreset[]).map(
                                            (preset) => (
                                                <Button
                                                    key={preset}
                                                    variant={cropPreset === preset ? 'default' : 'outline'}
                                                    size='sm'
                                                    onClick={() => applyCropPreset(preset)}
                                                    disabled={isBusy}
                                                >
                                                    {preset === 'original'
                                                        ? 'Asli'
                                                        : preset === 'square'
                                                          ? '1:1'
                                                          : preset === 'landscape'
                                                            ? '16:9'
                                                            : preset === 'portrait'
                                                              ? '3:4'
                                                              : 'Bebas'}
                                                </Button>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <div className='rounded-xl border bg-accent/40 p-4'>
                                    <div className='mb-4 flex items-center justify-between gap-3'>
                                        <div>
                                            <p className='font-medium'>Pengaturan Resize</p>
                                            <p className='text-muted-foreground text-sm'>
                                                Min {MIN_DIMENSION}px, maks {MAX_DIMENSION}px.
                                            </p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <span className='text-sm'>Kunci Rasio</span>
                                            <Switch
                                                checked={keepResizeAspect}
                                                onCheckedChange={(checked) => setKeepResizeAspect(Boolean(checked))}
                                            />
                                        </div>
                                    </div>
                                    <div className='mb-4 flex flex-wrap gap-2'>
                                        {resizePresets.map((preset) => (
                                            <Button
                                                key={preset.label}
                                                variant='outline'
                                                size='sm'
                                                onClick={() => applyResizePreset(preset)}
                                                disabled={isBusy}
                                            >
                                                {preset.label}
                                            </Button>
                                        ))}
                                    </div>
                                    <div className='grid gap-3 sm:grid-cols-2'>
                                        <div className='grid gap-2'>
                                            <Label htmlFor='resize-width'>Lebar</Label>
                                            <Input
                                                id='resize-width'
                                                type='number'
                                                min={MIN_DIMENSION}
                                                max={MAX_DIMENSION}
                                                value={resizeWidth}
                                                onChange={(event) =>
                                                    handleResizeInputChange('width', event.target.value)
                                                }
                                            />
                                        </div>
                                        <div className='grid gap-2'>
                                            <Label htmlFor='resize-height'>Tinggi</Label>
                                            <Input
                                                id='resize-height'
                                                type='number'
                                                min={MIN_DIMENSION}
                                                max={MAX_DIMENSION}
                                                value={resizeHeight}
                                                onChange={(event) =>
                                                    handleResizeInputChange('height', event.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='rounded-xl border bg-accent/40 p-4'>
                                    <div className='mb-3 flex items-start justify-between gap-3'>
                                        <div>
                                            <p className='font-medium'>Preview</p>
                                            {previewDetails && (
                                                <p className='text-muted-foreground text-sm'>
                                                    Crop {previewDetails.cropWidth} x {previewDetails.cropHeight} px ·
                                                    Hasil {previewDetails.outputWidth} x {previewDetails.outputHeight}{' '}
                                                    px
                                                </p>
                                            )}
                                        </div>
                                        {previewLoading && (
                                            <span className='text-muted-foreground text-sm'>
                                                Memperbarui preview...
                                            </span>
                                        )}
                                    </div>
                                    <div className='flex min-h-64 items-center justify-center rounded-lg border bg-background p-4'>
                                        {previewUrl ? (
                                            <img
                                                src={previewUrl}
                                                alt='Preview hasil edit'
                                                className='max-h-72 max-w-full rounded-md object-contain'
                                            />
                                        ) : (
                                            <p className='text-muted-foreground text-sm'>
                                                Preview akan muncul di sini.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant='ghost' onClick={closeEditor} disabled={isBusy}>
                        Batal
                    </Button>
                    <Button variant='outline' onClick={resetEditor} disabled={isBusy}>
                        Reset
                    </Button>
                    <Button
                        onClick={() => setConfirmOpen(true)}
                        disabled={!previewUrl || Boolean(editorError) || previewLoading || isBusy || confirmOpen}
                    >
                        Simpan Perubahan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function FileUploadConfirmDialog() {
    const { confirmOpen, isBusy } = useFileUploadState();
    const { setConfirmOpen, applyEditedImage } = useFileUploadActions();

    return (
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Terapkan perubahan gambar?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Gambar yang dipilih akan diganti dengan hasil crop dan resize.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant='ghost' onClick={() => setConfirmOpen(false)} disabled={isBusy}>
                        Periksa Lagi
                    </Button>
                    <Button onClick={() => void applyEditedImage()} disabled={isBusy}>
                        Terapkan
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

const FileUpload = {
    Root: FileUploadRoot,
    Dropzone: FileUploadDropzone,
    Errors: FileUploadErrors,
    List: FileUploadList,
    EditorDialog: FileUploadEditorDialog,
    ConfirmDialog: FileUploadConfirmDialog,
};

export type { FileUploadItem, FileUploadProps };
export {
    disposeFileUploadItem,
    disposeFileUploadItems,
    FileUpload,
    getExtension,
    getIconFromFileType,
    isPreviewableImageFile,
    normalizeImageType,
    useFileUploadActions,
    useFileUploadState,
};
