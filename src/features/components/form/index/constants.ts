import { IconBell, IconBrandWhatsapp, IconMail } from '@tabler/icons-react';

const KB = 1024;
const MB = 1024 * KB;

const DIVISION_OPTIONS = [
    { label: 'Keuangan', value: 'finance' },
    { label: 'Operasional', value: 'operations' },
    { label: 'IT Support', value: 'it-support' },
    { label: 'HRD', value: 'human-resources' },
    { label: 'Penjualan', value: 'sales' },
] as const;

const MANAGER_OPTIONS = [
    { label: 'Ayu Lestari', value: 'ayu-lestari' },
    { label: 'Budi Santoso', value: 'budi-santoso' },
    { label: 'Citra Wulandari', value: 'citra-wulandari' },
    { label: 'Dimas Pratama', value: 'dimas-pratama' },
] as const;

const SKILL_OPTIONS = [
    { label: 'React', value: 'react' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'Figma', value: 'figma' },
    { label: 'Docker', value: 'docker' },
] as const;

const EMPLOYMENT_TYPE_OPTIONS = [
    { label: 'Tetap', value: 'permanent', description: 'Karyawan dengan kontrak tanpa batas waktu.' },
    { label: 'Kontrak', value: 'contract', description: 'Karyawan dengan masa kerja tertentu.' },
    { label: 'Magang', value: 'internship', description: 'Program belajar sambil bekerja.' },
] as const;

const NOTIFICATION_OPTIONS = [
    { label: 'Email', value: 'email', description: 'Ringkasan harian ke inbox.', icon: IconMail },
    { label: 'WhatsApp', value: 'whatsapp', description: 'Pesan instan untuk hal mendesak.', icon: IconBrandWhatsapp },
    { label: 'Push', value: 'push', description: 'Notifikasi di browser.', icon: IconBell },
];

const PERMISSION_GROUPS = [
    {
        value: 'employees',
        label: 'Karyawan',
        items: [
            { value: 'employees.read', label: 'Lihat karyawan' },
            { value: 'employees.create', label: 'Tambah karyawan' },
            { value: 'employees.update', label: 'Ubah karyawan' },
            { value: 'employees.delete', label: 'Hapus karyawan' },
        ],
    },
    {
        value: 'payrolls',
        label: 'Payroll',
        items: [
            { value: 'payrolls.read', label: 'Lihat payroll' },
            { value: 'payrolls.generate', label: 'Generate payroll' },
            { value: 'payrolls.export', label: 'Export payroll' },
        ],
    },
    {
        value: 'attendances',
        label: 'Absensi',
        items: [
            { value: 'attendances.read', label: 'Lihat absensi' },
            { value: 'attendances.approve', label: 'Setujui koreksi' },
        ],
    },
];

const ASYNC_STATUSES = [
    { value: 'pending', label: 'Pending' },
    { value: 'error', label: 'Error' },
    { value: 'success', label: 'Success' },
] as const;

const ATTACHMENT_CONSTRAINTS = {
    accept: 'image/*,application/pdf,.docx',
    multiple: true,
    minFiles: 1,
    maxFiles: 3,
    maxSize: 2 * MB,
    maxTotalSize: 5 * MB,
};

const PHOTO_MIMES = ['image/png', 'image/jpeg'];

const PHOTO_MAX_SIZE = 1 * MB;

const PHOTO_CONSTRAINTS = {
    accept: PHOTO_MIMES.join(','),
    maxSize: PHOTO_MAX_SIZE,
};

const BIRTH_DATE_MIN = new Date(1960, 0, 1);

const BIRTH_DATE_MAX = new Date(2008, 11, 31);

const SCHEDULE_DATE_MIN = new Date(2026, 0, 1);

const LEAVE_DATES_MAX = 5;

const TAKEN_EMAIL = 'ayu@contoh.id';

const RICH_TEXT_CONSTRAINTS = {
    required: true,
    maxLength: 500,
};

export {
    ASYNC_STATUSES,
    ATTACHMENT_CONSTRAINTS,
    BIRTH_DATE_MAX,
    BIRTH_DATE_MIN,
    DIVISION_OPTIONS,
    EMPLOYMENT_TYPE_OPTIONS,
    LEAVE_DATES_MAX,
    MANAGER_OPTIONS,
    NOTIFICATION_OPTIONS,
    PERMISSION_GROUPS,
    PHOTO_CONSTRAINTS,
    PHOTO_MAX_SIZE,
    PHOTO_MIMES,
    RICH_TEXT_CONSTRAINTS,
    SCHEDULE_DATE_MIN,
    SKILL_OPTIONS,
    TAKEN_EMAIL,
};
