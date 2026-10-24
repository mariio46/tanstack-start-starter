type ExampleTicketStatus = 'Belum Mulai' | 'Dikerjakan' | 'Selesai';

type ExampleTicketPriority = 'rendah' | 'sedang' | 'tinggi' | 'mendesak';

type ExampleTicket = {
    id: string;
    ticket_number: string;
    title: string;
    requester: string;
    division: string;
    status: ExampleTicketStatus;
    priority: ExampleTicketPriority;
    created: string;
};

const TITLES = [
    'Printer lantai dua sering macet',
    'VPN terputus setiap sepuluh menit',
    'Export payroll menghasilkan file kosong',
    'Layar ruang rapat tidak ada sinyal',
    'Email reset password tidak pernah masuk',
    'PDF invoice tampil tanpa logo',
    'Scanner gudang kehilangan pairing',
    'Mesin absensi terlambat satu jam',
    'Shared drive read-only sejak Senin',
    'Aplikasi mobile crash di tab laporan',
    'Portal pelanggan menolak kupon valid',
    'Backup job selesai dengan peringatan',
];

const REQUESTERS = [
    'Ayu Lestari',
    'Budi Santoso',
    'Citra Wulandari',
    'Dimas Pratama',
    'Eka Putri',
    'Fajar Nugroho',
    'Gilang Ramadhan',
    'Hana Safitri',
];

const DIVISIONS = ['Keuangan', 'Operasional', 'IT Support', 'HRD', 'Penjualan'];

const STATUSES: ExampleTicketStatus[] = ['Belum Mulai', 'Dikerjakan', 'Selesai'];

const PRIORITIES: ExampleTicketPriority[] = ['rendah', 'sedang', 'tinggi', 'mendesak'];

const BASE_DATE = Date.UTC(2026, 5, 30, 12);

const DAY = 24 * 60 * 60 * 1000;

function pick<T>(list: T[], index: number, stride: number) {
    return list[(index * stride) % list.length];
}

function createTickets(count: number): ExampleTicket[] {
    return Array.from({ length: count }, (_, index) => ({
        id: `ticket-${String(index + 1).padStart(5, '0')}`,
        ticket_number: `TCK-${String(index + 1).padStart(5, '0')}`,
        title: pick(TITLES, index, 5),
        requester: pick(REQUESTERS, index, 3),
        division: pick(DIVISIONS, index, 2),
        status: pick(STATUSES, index, 1),
        priority: pick(PRIORITIES, index, 3),
        created: new Date(BASE_DATE - ((index * 3) % 180) * DAY).toISOString(),
    }));
}

const EXAMPLE_TICKETS = createTickets(60);

const EXAMPLE_TICKETS_LARGE = createTickets(2000);

const EMPTY_TICKETS: ExampleTicket[] = [];

const statusVariants = {
    'Belum Mulai': 'muted',
    Dikerjakan: 'warning-light',
    Selesai: 'success-light',
} as const;

const priorityVariants = {
    rendah: 'muted',
    sedang: 'info',
    tinggi: 'warning-light',
    mendesak: 'destructive-light',
} as const;

export type { ExampleTicket, ExampleTicketPriority, ExampleTicketStatus };
export { EMPTY_TICKETS, EXAMPLE_TICKETS, EXAMPLE_TICKETS_LARGE, priorityVariants, statusVariants };
