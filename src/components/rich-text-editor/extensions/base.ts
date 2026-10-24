import { AriaLiveRegionExtension, EditorModeAnnounceExtension, HistoryAnnounceExtension } from '@lexical/a11y';
import {
    ClearEditorExtension,
    ClickAfterLastBlockExtension,
    NodeSelectionExtension,
    SelectBlockExtension,
    TabIndentationExtension,
} from '@lexical/extension';
import { HistoryExtension } from '@lexical/history';
import { RichTextExtension } from '@lexical/rich-text';
import { configExtension, defineExtension } from 'lexical';

import { MAX_LIST_INDENT } from '@/components/rich-text-editor/constants';
import { editorTheme } from '@/components/rich-text-editor/theme';

const BaseExtension = defineExtension({
    name: '@rich-text-editor/base',
    namespace: 'rich-text-editor',
    theme: editorTheme,
    onError: (error) => {
        throw error;
    },
    dependencies: [
        RichTextExtension,
        HistoryExtension,
        configExtension(TabIndentationExtension, { maxIndent: MAX_LIST_INDENT }),
        ClearEditorExtension,
        ClickAfterLastBlockExtension,
        SelectBlockExtension,
        NodeSelectionExtension,
        AriaLiveRegionExtension,
        HistoryAnnounceExtension,
        EditorModeAnnounceExtension,
    ],
});

export { BaseExtension };
