import { KB, MB } from './constants';

type SampleDocument = {
    name: string;
    type: string;
    size: number;
};

type SampleImage = {
    name: string;
    type: 'image/png' | 'image/jpeg';
    width: number;
    height: number;
    label: string;
    colors: [string, string];
};

const SAMPLE_DOCUMENTS: SampleDocument[] = [
    { name: 'laporan-bulanan.pdf', type: 'application/pdf', size: 240 * KB },
    { name: 'data-karyawan.csv', type: 'text/csv', size: 18 * KB },
    {
        name: 'rekap-gaji.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 96 * KB,
    },
    {
        name: 'kontrak-kerja.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 120 * KB,
    },
    { name: 'catatan-rapat.txt', type: 'text/plain', size: 4 * KB },
    { name: 'panduan-onboarding.md', type: 'text/markdown', size: 6 * KB },
    { name: 'arsip-dokumen.zip', type: 'application/zip', size: 640 * KB },
    { name: 'backup-database.tar.gz', type: 'application/gzip', size: 820 * KB },
    { name: 'video-pelatihan.mp4', type: 'video/mp4', size: 3 * MB },
];

const SAMPLE_IMAGES: SampleImage[] = [
    {
        name: 'lanskap.png',
        type: 'image/png',
        width: 1600,
        height: 1000,
        label: 'Lanskap',
        colors: ['#0ea5e9', '#6366f1'],
    },
    {
        name: 'potret.jpg',
        type: 'image/jpeg',
        width: 900,
        height: 1200,
        label: 'Potret',
        colors: ['#f97316', '#db2777'],
    },
];

const SAMPLE_GRID_SIZE = 100;

function createSampleDocuments() {
    return SAMPLE_DOCUMENTS.map(
        ({ name, type, size }) => new File([new Uint8Array(size)], name, { type, lastModified: Date.now() }),
    );
}

async function createSampleImage({ name, type, width, height, label, colors }: SampleImage) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Canvas tidak tersedia di browser ini.');
    }

    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.beginPath();
    for (let x = SAMPLE_GRID_SIZE; x < width; x += SAMPLE_GRID_SIZE) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
    }
    for (let y = SAMPLE_GRID_SIZE; y < height; y += SAMPLE_GRID_SIZE) {
        context.moveTo(0, y);
        context.lineTo(width, y);
    }
    context.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `600 ${Math.round(width / 10)}px sans-serif`;
    context.fillText(label, width / 2, height / 2 - width / 16);
    context.font = `400 ${Math.round(width / 24)}px sans-serif`;
    context.fillText(`${width} × ${height} px`, width / 2, height / 2 + width / 16);

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (result) => {
                if (!result) {
                    reject(new Error('Gagal membuat gambar contoh.'));
                    return;
                }

                resolve(result);
            },
            type,
            0.9,
        );
    });

    return new File([blob], name, { type, lastModified: Date.now() });
}

function createSampleImages() {
    return Promise.all(SAMPLE_IMAGES.map(createSampleImage));
}

async function createSampleFiles() {
    return [await createSampleImage(SAMPLE_IMAGES[0]), ...createSampleDocuments()];
}

export { createSampleFiles, createSampleImages };
