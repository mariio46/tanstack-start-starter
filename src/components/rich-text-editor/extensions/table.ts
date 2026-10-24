import { TableExtension } from '@lexical/table';
import { configExtension, defineExtension } from 'lexical';

const EditorTableExtension = defineExtension({
    name: '@rich-text-editor/table',
    dependencies: [
        configExtension(TableExtension, {
            hasCellMerge: true,
            hasCellBackgroundColor: true,
            hasTabHandler: true,
            hasHorizontalScroll: true,
            hasNestedTables: false,
        }),
    ],
});

export { EditorTableExtension };
