import { ExamplePage, ExampleSection } from '@/components/custom/example-section';

import { BlockerForm } from './blocker';
import { ChoiceFieldsForm } from './choice-fields';
import { CompositionForm } from './composition';
import { TAKEN_EMAIL } from './constants';
import { DateFieldsForm } from './date-fields';
import { FileFieldsForm } from './file-fields';
import { RichTextFieldForm } from './rich-text-field';
import { TextFieldsForm } from './text-fields';
import { ValidationForm } from './validation';

const FormMain = () => {
    return (
        <ExamplePage
            title='Form'
            description='Semua contoh memakai useAppForm dari createFormHook yang sama: field component didaftarkan sekali, lalu dipanggil lewat form.AppField dan validator Zod.'
        >
            <ExampleSection
                title='Field teks'
                description='field.Input, field.InputPassword, field.InputNumber (nilai number, prefix Rp), field.InputGroup (dengan addon), dan field.Textarea. Pesan error muncul di bawah field setelah submit.'
            >
                <TextFieldsForm />
            </ExampleSection>

            <ExampleSection
                title='Pilihan'
                description='field.Combobox sync dan async (status pending, error, atau success dipilih lewat tombol), field.ComboboxMultiple, field.RadioCards, field.CheckboxCards, field.CheckboxGroups dengan pencarian, dan field.Checkbox.'
            >
                <ChoiceFieldsForm />
            </ExampleSection>

            <ExampleSection
                title='Tanggal'
                description='field.InputDate dengan batas min/max, field.InputDateTime (nilai YYYY-MM-DDTHH:mm), dan field.InputDateMultiple dengan batas jumlah tanggal serta akhir pekan dinonaktifkan.'
            >
                <DateFieldsForm />
            </ExampleSection>

            <ExampleSection
                title='File'
                description='field.InputFile memakai constraint dari @/lib/file (accept, jumlah, dan ukuran), sedangkan field.FileUpload menyediakan dropzone serta editor crop dan resize untuk gambar.'
            >
                <FileFieldsForm />
            </ExampleSection>

            <ExampleSection
                title='Rich text'
                description='field.RichTextEditor (Lexical, hanya dirender di browser dan di-lazy-load) menyimpan nilai sebagai Lexical JSON string. richTextSchema mewajibkan isi dan membatasinya 500 karakter, dihitung sama dengan penghitung karakter editor.'
            >
                <RichTextFieldForm />
            </ExampleSection>

            <ExampleSection
                title='Validasi dan error server'
                description={`Email divalidasi saat blur, seluruh form divalidasi saat submit, lalu submit menunggu respons buatan. Pakai email ${TAKEN_EMAIL} untuk melihat error server dari toFormErrorMap: pesan form-level di form.AlertError dan pesan per field di bawah input.`}
            >
                <ValidationForm />
            </ExampleSection>

            <ExampleSection
                title='withForm dan withFieldGroup'
                description='Field dipisah ke komponen withForm, dan satu withFieldGroup alamat dipakai dua kali untuk billing dan shipping dengan validasi nested.'
            >
                <CompositionForm />
            </ExampleSection>

            <ExampleSection
                title='Form blocker'
                description='useFormBlocker menahan navigasi route saat form dirty, dan FormBlockerDialog menahan dialog agar tidak tertutup tanpa konfirmasi Buang perubahan.'
            >
                <BlockerForm />
            </ExampleSection>
        </ExamplePage>
    );
};

export { FormMain };
