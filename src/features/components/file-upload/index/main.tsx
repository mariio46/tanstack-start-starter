import { formatFileSize } from '@/lib/file';

import { ExamplePage, ExampleSection } from '@/components/custom/example-section';

import { BasicFileUpload } from './basic';
import { ComposableFileUpload } from './composable';
import { DOCUMENT_MAX_SIZE, MULTIPLE_MAX, MULTIPLE_MIN } from './constants';
import { ConstraintsFileUpload } from './constraints';
import { ControlledFileUpload } from './controlled';
import { ImageEditorFileUpload } from './image-editor';
import { DialogFileUpload } from './in-dialog';
import { MultipleFileUpload } from './multiple';

const FileUploadMain = () => {
    return (
        <ExamplePage
            title='File Upload'
            description='FileUpload.Root menggabungkan dropzone, daftar file dengan ikon per tipe, dan editor crop/resize gambar di atas react-image-crop. Nilainya File[]. Contoh TanStack Form-nya (field.FileUpload) ada di section File pada halaman Form.'
        >
            <ExampleSection
                title='Bawaan'
                description='Tanpa value, komponen memegang state sendiri dan melaporkan File[] lewat onChange. Mode single mengganti file lama, dan batas ukuran bawaannya 1 MB.'
            >
                <BasicFileUpload />
            </ExampleSection>

            <ExampleSection
                title='Banyak file'
                description={`multiple menambah file ke daftar sampai max (di sini ${MULTIPLE_MAX}). File yang berlebih atau sudah ada di daftar dilewati beserta alasannya, dan min (${MULTIPLE_MIN}) menampilkan peringatan selama jumlah file masih kurang.`}
            >
                <MultipleFileUpload />
            </ExampleSection>

            <ExampleSection
                title='Format dan ukuran'
                description={`mimes menjadi atribut accept dan menyaring file yang dipilih atau di-drop: MIME persis (application/pdf), wildcard (image/*), atau ekstensi (.docx). File di atas maxSize (${formatFileSize(DOCUMENT_MAX_SIZE)}) tetap masuk tapi ditandai merah, jadi tolak lewat schema.`}
            >
                <ConstraintsFileUpload />
            </ExampleSection>

            <ExampleSection
                title='Controlled dan ActionButton'
                description='Parent memegang value. ActionButton menaruh tombol tambahan di dropzone, di sini untuk memuat satu file contoh per tipe sampai batas bawaan 10 file. Value dari parent tidak disaring ulang: mimes dan max hanya berlaku untuk file yang dipilih atau di-drop, sedangkan tanda ukuran tetap dihitung.'
            >
                <ControlledFileUpload />
            </ExampleSection>

            <ExampleSection
                title='Editor gambar'
                description='Tombol crop muncul untuk JPEG, PNG, dan WebP. Editor menyediakan preset rasio (Asli, 1:1, 16:9, 3:4, Bebas) dengan Kunci Rasio, zoom 1–3x, preset dan input resize 100–5000 px, serta preview langsung. Simpan meminta konfirmasi, lalu file diganti hasil edit dengan nama yang sama. Enter menyimpan, Escape membatalkan.'
            >
                <ImageEditorFileUpload />
            </ExampleSection>

            <ExampleSection
                title='Di dalam dialog'
                description='Value dipegang parent, jadi file, thumbnail, dan editor tetap berfungsi setelah dialog ditutup lalu dibuka lagi. Editor dan konfirmasinya menjadi dialog bertingkat, dan Escape hanya menutup dialog paling atas.'
            >
                <DialogFileUpload />
            </ExampleSection>

            <ExampleSection
                title='Composable'
                description='children menggantikan layout bawaan: FileUpload.Dropzone, Errors, List, EditorDialog, dan ConfirmDialog bisa disusun bebas. Preview foto membaca useFileUploadState, sedangkan tombol Ganti, Edit, dan Hapus memanggil useFileUploadActions. field.FileUpload meneruskan children yang sama.'
            >
                <ComposableFileUpload />
            </ExampleSection>
        </ExamplePage>
    );
};

export { FileUploadMain };
