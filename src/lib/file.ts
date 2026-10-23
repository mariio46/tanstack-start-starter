const FILE_KINDS = [
    'image',
    'video',
    'audio',
    'pdf',
    'archive',
    'spreadsheet',
    'presentation',
    'document',
    'text',
    'code',
    'file',
] as const;

type FileKind = (typeof FILE_KINDS)[number];

type FileRejectionReason = 'type' | 'size' | 'total-size' | 'count' | 'duplicate';

interface FileRejection {
    file: File;
    reason: FileRejectionReason;
    message: string;
}

interface FileConstraints {
    accept?: string;
    multiple?: boolean;
    minFiles?: number;
    maxFiles?: number;
    maxSize?: number;
    maxTotalSize?: number;
}

interface FileLike {
    name: string;
    type: string;
}

const EXTENSION_KINDS: Record<string, FileKind> = {
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    gif: 'image',
    webp: 'image',
    avif: 'image',
    bmp: 'image',
    svg: 'image',
    ico: 'image',
    heic: 'image',
    heif: 'image',
    mp4: 'video',
    webm: 'video',
    mov: 'video',
    mkv: 'video',
    avi: 'video',
    m4v: 'video',
    mp3: 'audio',
    wav: 'audio',
    ogg: 'audio',
    flac: 'audio',
    aac: 'audio',
    m4a: 'audio',
    pdf: 'pdf',
    zip: 'archive',
    rar: 'archive',
    '7z': 'archive',
    tar: 'archive',
    gz: 'archive',
    bz2: 'archive',
    xls: 'spreadsheet',
    xlsx: 'spreadsheet',
    csv: 'spreadsheet',
    ods: 'spreadsheet',
    ppt: 'presentation',
    pptx: 'presentation',
    odp: 'presentation',
    doc: 'document',
    docx: 'document',
    odt: 'document',
    rtf: 'document',
    txt: 'text',
    md: 'text',
    log: 'text',
    js: 'code',
    mjs: 'code',
    cjs: 'code',
    jsx: 'code',
    ts: 'code',
    tsx: 'code',
    json: 'code',
    html: 'code',
    css: 'code',
    scss: 'code',
    xml: 'code',
    yml: 'code',
    yaml: 'code',
    sql: 'code',
    sh: 'code',
    py: 'code',
    go: 'code',
    rs: 'code',
    php: 'code',
};

const MIME_KINDS: Record<string, FileKind> = {
    'application/pdf': 'pdf',
    'application/zip': 'archive',
    'application/x-zip-compressed': 'archive',
    'application/x-rar-compressed': 'archive',
    'application/vnd.rar': 'archive',
    'application/x-7z-compressed': 'archive',
    'application/x-tar': 'archive',
    'application/gzip': 'archive',
    'application/vnd.ms-excel': 'spreadsheet',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet',
    'application/vnd.oasis.opendocument.spreadsheet': 'spreadsheet',
    'text/csv': 'spreadsheet',
    'application/vnd.ms-powerpoint': 'presentation',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'presentation',
    'application/vnd.oasis.opendocument.presentation': 'presentation',
    'application/msword': 'document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
    'application/vnd.oasis.opendocument.text': 'document',
    'application/rtf': 'document',
    'application/json': 'code',
    'application/xml': 'code',
    'text/xml': 'code',
    'text/html': 'code',
    'text/css': 'code',
    'text/javascript': 'code',
    'application/javascript': 'code',
};

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

const SIZE_BASE = 1024;

function getExtension(name: string) {
    const index = name.lastIndexOf('.');

    return index > 0 ? name.slice(index + 1).toLowerCase() : '';
}

function getFileKind(file: FileLike): FileKind {
    const mime = file.type.toLowerCase();

    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';

    const byMime = MIME_KINDS[mime];

    if (byMime) return byMime;

    const byExtension = EXTENSION_KINDS[getExtension(file.name)];

    if (byExtension) return byExtension;

    return mime.startsWith('text/') ? 'text' : 'file';
}

function isImageFile(file: FileLike) {
    return file.type.toLowerCase().startsWith('image/');
}

function formatFileSize(bytes: number, fractionDigits: number = 1) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';

    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(SIZE_BASE)), SIZE_UNITS.length - 1);
    const value = bytes / SIZE_BASE ** exponent;
    const digits = exponent === 0 ? 0 : fractionDigits;

    return `${value.toFixed(digits).replace(/\.0+$/, '')} ${SIZE_UNITS[exponent]}`;
}

function formatFileType(file: FileLike) {
    if (file.type) return file.type;

    const extension = getExtension(file.name);

    return extension ? extension.toUpperCase() : 'Tidak diketahui';
}

function parseAccept(accept: string | undefined) {
    if (!accept) return [];

    return accept
        .split(',')
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean);
}

function matchesAccept(file: FileLike, accept: string | undefined) {
    const tokens = parseAccept(accept);

    if (tokens.length === 0) return true;

    const mime = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    return tokens.some((token) => {
        if (token.startsWith('.')) return name.endsWith(token);
        if (token === '*/*') return true;
        if (token.endsWith('/*')) return mime.startsWith(`${token.slice(0, -1)}`);

        return mime === token;
    });
}

function describeAccept(accept: string | undefined) {
    const tokens = parseAccept(accept);

    if (tokens.length === 0) return 'Semua jenis file';

    const labels = tokens.map((token) => {
        if (token.startsWith('.')) return token.slice(1).toUpperCase();
        if (token.endsWith('/*')) return `File ${token.slice(0, -2).toUpperCase()}`;

        const subtype = token.split('/')[1];

        return (subtype ?? token).toUpperCase();
    });

    return [...new Set(labels)].join(', ');
}

function getFileKey(file: File) {
    return `${file.name}:${file.size}:${file.lastModified}`;
}

function getTotalSize(files: readonly File[]) {
    return files.reduce((total, file) => total + file.size, 0);
}

function pickFiles(current: readonly File[], incoming: readonly File[], constraints: FileConstraints = {}) {
    const { accept, multiple = false, maxFiles, maxSize, maxTotalSize } = constraints;

    const limit = multiple ? maxFiles : 1;
    const base = multiple ? [...current] : [];
    const files = [...base];
    const rejections: FileRejection[] = [];

    const keys = new Set(files.map(getFileKey));

    let total = getTotalSize(files);

    for (const file of incoming) {
        if (keys.has(getFileKey(file))) {
            rejections.push({ file, reason: 'duplicate', message: `${file.name} sudah ditambahkan.` });
            continue;
        }

        if (!matchesAccept(file, accept)) {
            rejections.push({ file, reason: 'type', message: `Jenis file ${file.name} tidak diizinkan.` });
            continue;
        }

        if (maxSize !== undefined && file.size > maxSize) {
            rejections.push({
                file,
                reason: 'size',
                message: `${file.name} melebihi batas ${formatFileSize(maxSize)} per file.`,
            });
            continue;
        }

        if (limit !== undefined && files.length >= limit) {
            rejections.push({
                file,
                reason: 'count',
                message:
                    limit === 1
                        ? `${file.name} dilewati karena hanya boleh satu file.`
                        : `${file.name} dilewati karena maksimal ${limit} file.`,
            });
            continue;
        }

        if (maxTotalSize !== undefined && total + file.size > maxTotalSize) {
            rejections.push({
                file,
                reason: 'total-size',
                message: `${file.name} melebihi batas total ${formatFileSize(maxTotalSize)}.`,
            });
            continue;
        }

        files.push(file);
        keys.add(getFileKey(file));
        total += file.size;
    }

    return { files, rejections };
}

function validateFiles(files: readonly File[], constraints: FileConstraints = {}): string | null {
    const { minFiles, maxFiles, maxSize, maxTotalSize, accept, multiple = false } = constraints;

    if (minFiles !== undefined && files.length < minFiles) {
        return minFiles === 1
            ? 'Minimal satu file wajib diisi.'
            : `Minimal ${minFiles} file wajib diisi, tetapi hanya ${files.length} yang diberikan.`;
    }

    const limit = multiple ? maxFiles : (maxFiles ?? 1);

    if (limit !== undefined && files.length > limit) {
        return limit === 1
            ? 'Hanya boleh satu file.'
            : `Maksimal ${limit} file, tetapi ${files.length} yang diberikan.`;
    }

    const oversized = maxSize === undefined ? undefined : files.find((file) => file.size > maxSize);

    if (oversized && maxSize !== undefined) {
        return `${oversized.name} melebihi batas ${formatFileSize(maxSize)} per file.`;
    }

    const rejected = files.find((file) => !matchesAccept(file, accept));

    if (rejected) {
        return `Jenis file ${rejected.name} tidak diizinkan.`;
    }

    if (maxTotalSize !== undefined && getTotalSize(files) > maxTotalSize) {
        return `File yang dipilih melebihi batas total ${formatFileSize(maxTotalSize)}.`;
    }

    return null;
}

export type { FileConstraints, FileKind, FileLike, FileRejection, FileRejectionReason };
export {
    describeAccept,
    FILE_KINDS,
    formatFileSize,
    formatFileType,
    getFileKey,
    getFileKind,
    getTotalSize,
    isImageFile,
    matchesAccept,
    pickFiles,
    validateFiles,
};
