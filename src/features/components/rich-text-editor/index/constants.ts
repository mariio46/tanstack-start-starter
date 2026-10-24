import { pending } from '@/lib/utils';

import { markdownToRichText } from '@/components/rich-text-editor/convert';
import type { MentionItem } from '@/components/rich-text-editor/rich-text-editor';

const EXAMPLE_MENTIONS: MentionItem[] = [
    { id: 'user-1', name: 'Alya Rahmawati', description: 'Product Designer' },
    { id: 'user-2', name: 'Bima Santoso', description: 'Frontend Engineer' },
    { id: 'user-3', name: 'Citra Lestari', description: 'Engineering Manager' },
    { id: 'user-4', name: 'Dimas Pratama', description: 'Backend Engineer' },
    { id: 'user-5', name: 'Eka Putri', description: 'QA Engineer' },
    { id: 'user-6', name: 'Fajar Nugroho', description: 'DevOps Engineer' },
    { id: 'user-7', name: 'Gita Maharani', description: 'Product Manager' },
    { id: 'user-8', name: 'Hendra Wijaya', description: 'Data Analyst' },
    { id: 'user-9', name: 'Indah Permata', description: 'UX Researcher' },
    { id: 'user-10', name: 'Joko Susilo', description: 'Mobile Engineer' },
];

const EXAMPLE_MARKDOWN = `# Catatan rilis

Selamat datang di **rich text editor**. Pilih teks untuk memformatnya, ketik \`/\` untuk perintah, atau \`@\` untuk menyebut rekan tim. Tag seperti #rilis otomatis disorot.

## Yang baru

- **Slash command** untuk heading, daftar, tabel, gambar, dan kolom
- *Toolbar mengambang* saat teks dipilih, dengan opsi format yang ~~lebih sedikit~~ lebih banyak
- Import dan export sebagai JSON, Markdown, atau HTML — lihat [dokumentasi Lexical](https://lexical.dev)

### Checklist peluncuran

- [x] Tulis changelog
- [x] Tinjau toolbar
- [ ] Umumkan rilis

> Export Markdown tidak menyimpan semuanya: warna, font, ukuran gambar, dan kolom akan hilang.

\`\`\`ts
const value = markdownToRichText('# Halo');
const html = richTextToHtml(value);
\`\`\`

| Format | Import | Export |
| --- | --- | --- |
| JSON | Ya | Ya |
| Markdown | Ya | Ya |
| HTML | Ya | Ya |

---

1. Buka menu **Sisipkan**
2. Pilih sebuah blok
3. Mulai menulis
`;

const EXAMPLE_VALUE = markdownToRichText(EXAMPLE_MARKDOWN);

const EXAMPLE_DRAFT_VALUE = markdownToRichText(
    'Ubah **draft** ini, lalu submit form atau reset untuk mengembalikan teks ini.',
);

const COMPOSABLE_MINIMAL_VALUE = markdownToRichText(
    'Hanya **tebal**, *miring*, dan [link](https://lexical.dev) — pilih teks lalu tekan Ctrl/⌘+K.',
);

const COMPOSABLE_BLOCK_VALUE = markdownToRichText(`## Block editor

Arahkan kursor ke sebuah blok untuk menyeretnya lewat grip, atau tekan + untuk membuka slash menu.

- Ketik "/" untuk menyisipkan blok
- Pilih teks untuk memunculkan toolbar mengambang

- [ ] Seret item ini ke paling atas`);

async function searchMentions(query: string) {
    await pending(200);

    const normalized = query.toLowerCase();

    return EXAMPLE_MENTIONS.filter((mention) =>
        mention.name
            .toLowerCase()
            .split(' ')
            .some((word) => word.startsWith(normalized)),
    );
}

export {
    COMPOSABLE_BLOCK_VALUE,
    COMPOSABLE_MINIMAL_VALUE,
    EXAMPLE_DRAFT_VALUE,
    EXAMPLE_MARKDOWN,
    EXAMPLE_MENTIONS,
    EXAMPLE_VALUE,
    searchMentions,
};
