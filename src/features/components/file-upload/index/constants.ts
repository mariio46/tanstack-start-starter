const KB = 1024;

const MB = 1024 * KB;

const MULTIPLE_MIN = 2;

const MULTIPLE_MAX = 4;

const DOCUMENT_MIMES = ['image/*', 'application/pdf', '.docx'];

const DOCUMENT_MAX_SIZE = 500 * KB;

const SAMPLE_MAX_SIZE = 2 * MB;

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

const IMAGE_MAX_SIZE = 2 * MB;

const PHOTO_MAX_SIZE = 1 * MB;

export {
    DOCUMENT_MAX_SIZE,
    DOCUMENT_MIMES,
    IMAGE_MAX_SIZE,
    IMAGE_MIMES,
    KB,
    MB,
    MULTIPLE_MAX,
    MULTIPLE_MIN,
    PHOTO_MAX_SIZE,
    SAMPLE_MAX_SIZE,
};
