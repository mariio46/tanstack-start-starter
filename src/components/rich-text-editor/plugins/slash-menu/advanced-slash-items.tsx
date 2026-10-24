import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { IconCode, IconColumns, IconTable } from '@tabler/icons-react';
import type { LexicalEditor } from 'lexical';

import { TABLE_MAX_COLUMNS, TABLE_MAX_ROWS } from '@/components/rich-text-editor/constants';
import { $insertCodeBlock } from '@/components/rich-text-editor/extensions/code';
import { useEditorDialog } from '@/components/rich-text-editor/plugins/dialogs/dialog-host';
import { InsertColumnsDialog } from '@/components/rich-text-editor/plugins/dialogs/insert-columns-dialog';
import { InsertTableDialog } from '@/components/rich-text-editor/plugins/dialogs/insert-table-dialog';
import { useFormatState } from '@/components/rich-text-editor/plugins/toolbar/editor-toolbar';

import type { SlashMenuItem } from './editor-slash-menu';
import { useSlashMenuItems } from './editor-slash-menu';

const TABLE_SIZE_PATTERN = /^(\d{1,2})(?:\s*x\s*(\d{1,2})?)?$/i;
const TABLE_QUICK_COLUMNS = 5;

function tableSizeItems(editor: LexicalEditor, query: string): SlashMenuItem[] {
    const match = TABLE_SIZE_PATTERN.exec(query.trim());
    if (!match) return [];

    const rows = Number(match[1]);
    if (rows < 1 || rows > TABLE_MAX_ROWS) return [];

    const columns = match[2]
        ? [Number(match[2])]
        : Array.from({ length: Math.min(TABLE_QUICK_COLUMNS, TABLE_MAX_COLUMNS) }, (_, index) => index + 1);

    return columns
        .filter((count) => count >= 1 && count <= TABLE_MAX_COLUMNS)
        .map((count) => ({
            value: `table-${rows}x${count}`,
            label: `Tabel ${rows}×${count}`,
            icon: IconTable,
            description: `${rows} baris, ${count} kolom`,
            group: 'Lanjutan',
            onSelect: () =>
                editor.dispatchCommand(INSERT_TABLE_COMMAND, {
                    rows: String(rows),
                    columns: String(count),
                    includeHeaders: { rows: true, columns: false },
                }),
        }));
}

function AdvancedSlashItems() {
    const [editor] = useLexicalComposerContext();
    const dialog = useEditorDialog();
    const { isInTable } = useFormatState();

    const tableItems: SlashMenuItem[] = [
        {
            value: 'table',
            label: 'Tabel',
            icon: IconTable,
            description: 'Sisipkan tabel, atau ketik ukuran seperti 3x4',
            group: 'Lanjutan',
            keywords: ['grid', 'spreadsheet', 'rows', 'columns', 'baris', 'kolom'],
            onSelect: () => dialog.open((close) => <InsertTableDialog close={close} />),
        },
    ];

    const codeItems: SlashMenuItem[] = [
        {
            value: 'code',
            label: 'Code block',
            icon: IconCode,
            description: 'Tulis potongan kode',
            group: 'Lanjutan',
            keywords: ['code', 'snippet', 'pre', 'program', 'kode'],
            onSelect: $insertCodeBlock,
        },
    ];

    const columnItems: SlashMenuItem[] = [
        {
            value: 'columns',
            label: 'Kolom',
            icon: IconColumns,
            description: 'Bagi konten menjadi beberapa kolom',
            group: 'Lanjutan',
            keywords: ['layout', 'grid', 'side by side', 'tata letak'],
            onSelect: () => dialog.open((close) => <InsertColumnsDialog close={close} />),
        },
    ];

    useSlashMenuItems(isInTable ? codeItems : [...tableItems, ...codeItems, ...columnItems]);
    useSlashMenuItems((query) => (isInTable ? [] : tableSizeItems(editor, query)));

    return null;
}

export { AdvancedSlashItems };
