import { ExamplePage, ExampleSection } from '@/components/custom/example-section';

import { BasicDataTable } from './basic';
import { FilteringDataTable } from './filtering';
import { SelectionDataTable } from './selection';
import { SkeletonDataTable } from './skeleton';
import { StatesDataTable } from './states';
import { VirtualizationDataTable } from './virtualization';

const DataTableMain = () => {
    return (
        <ExamplePage
            title='Data Table'
            description='Semua contoh di bawah memakai hook useAppTable dan feature set yang sama, hanya datanya berupa array statis.'
        >
            <ExampleSection
                title='Dasar, sorting, dan pagination'
                description='Mode client-side: tanpa flag manual*, jadi sorted, filtered, dan paginated row model bawaan yang bekerja. Single sort, klik pertama ascending.'
            >
                <BasicDataTable />
            </ExampleSection>

            <ExampleSection
                title='Pencarian, faceted filter, dan rentang tanggal'
                description='Kotak pencarian menulis ke global filter, tiap faceted filter mengambil opsi dari facet kolomnya, dan rentang tanggal menulis tuple [from, to] ke kolom Dibuat. Reset menghapus semua column filter sekaligus.'
            >
                <FilteringDataTable />
            </ExampleSection>

            <ExampleSection
                title='Row selection dan action bar'
                description='Kolom checkbox yang sticky berdasarkan row id, plus action bar mengambang yang muncul begitu ada baris terpilih. Hapus hanya membuang baris dari state lokal — Kembalikan baris memunculkannya lagi.'
            >
                <SelectionDataTable />
            </ExampleSection>

            <ExampleSection
                title='Pending, fetching, error, dan kosong'
                description='table.Content merender skeleton saat pending, meredupkan body saat fetching, panel retry saat error, dan panel kosong saat tidak ada baris yang cocok. Pilih state untuk melihat masing-masing.'
            >
                <StatesDataTable />
            </ExampleSection>

            <ExampleSection
                title='Skeleton tabel'
                description='DataTableSkeleton untuk pendingComponent route: toolbar, baris, dan footer tanpa instance tabel.'
            >
                <SkeletonDataTable />
            </ExampleSection>

            <ExampleSection
                title='Virtualisasi dan kolom sticky'
                description='Seribu baris per halaman dengan virtual aktif. Virtualisasi baru menyala setelah jumlah baris melewati threshold, dan kolom select serta aksi tetap menempel saat tabel di-scroll ke samping.'
            >
                <VirtualizationDataTable />
            </ExampleSection>
        </ExamplePage>
    );
};

export { DataTableMain };
