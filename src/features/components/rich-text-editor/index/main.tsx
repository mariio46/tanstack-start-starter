import { ExamplePage, ExampleSection } from '@/components/custom/example-section';

import { ComposableRichTextEditor } from './composable';
import { ControlledRichTextEditor } from './controlled';
import { StandaloneRichTextEditor } from './standalone';
import { StatesRichTextEditor } from './states';
import { TreeViewRichTextEditor } from './tree-view';
import { UncontrolledRichTextEditor } from './uncontrolled';

const RichTextEditorMain = () => {
    return (
        <ExamplePage
            title='Rich Text Editor'
            description='Editor berbasis Lexical dengan toolbar, slash command, dan overlay mengambang. Nilainya berupa Lexical JSON string, dan dokumen kosong berarti string kosong. Editor hanya dirender di browser; contoh TanStack Form-nya ada di section Rich text pada halaman Form.'
        >
            <ExampleSection
                title='Editor lengkap'
                description='Preset dengan semua fitur aktif, diisi dari Markdown lewat markdownToRichText. Tanpa state eksternal — editor memegang kontennya sendiri.'
            >
                <StandaloneRichTextEditor />
            </ExampleSection>

            <ExampleSection
                title='Uncontrolled'
                description='Ikut form native lewat atribut name: input tersembunyi membawa JSON string. Reset form mengembalikan defaultValue.'
            >
                <UncontrolledRichTextEditor />
            </ExampleSection>

            <ExampleSection
                title='Controlled'
                description='Parent memegang value dan bisa mengganti atau mengosongkannya dari luar. Panel di samping mengonversi value yang sama ke HTML dan Markdown.'
            >
                <ControlledRichTextEditor />
            </ExampleSection>

            <ExampleSection
                title='Composable'
                description='Primitive yang sama disusun menjadi editor lain. Masing-masing memberi EditorRoot defineExtension sendiri yang hanya berisi node yang dibutuhkan, lalu memilih plugin-nya.'
            >
                <ComposableRichTextEditor />
            </ExampleSection>

            <ExampleSection
                title='State'
                description='readOnly menjaga konten tetap terbaca dan menyembunyikan tombol kunci. disabled juga meredupkan editor. invalid hanya memberi ring error.'
            >
                <StatesRichTextEditor />
            </ExampleSection>

            <ExampleSection
                title='Tree view'
                description='TreeViewPlugin yang dioper sebagai child preset menampilkan node tree secara langsung, DOM hasil export, dan time travel. Hanya untuk debugging.'
            >
                <TreeViewRichTextEditor />
            </ExampleSection>
        </ExamplePage>
    );
};

export { RichTextEditorMain };
