import { FocusManagerExtension } from '@lexical/a11y';
import { HorizontalRuleExtension } from '@lexical/extension';
import { HashtagExtension } from '@lexical/hashtag';
import { CheckListExtension, ListExtension } from '@lexical/list';
import { OverflowExtension } from '@lexical/overflow';
import { defineExtension } from 'lexical';

import { BaseExtension } from './extensions/base';
import { EditorCodeExtension } from './extensions/code';
import { FormatStateExtension } from './extensions/format-state';
import { ImageExtension } from './extensions/image';
import { LayoutExtension } from './extensions/layout';
import { EditorLinkExtension } from './extensions/link';
import { MarkdownShortcutsExtension } from './extensions/markdown';
import { MentionExtension } from './extensions/mention';
import { EditorShortcutsExtension } from './extensions/shortcuts';
import { EditorTableExtension } from './extensions/table';

const RichTextEditorExtension = defineExtension({
    name: '@rich-text-editor/preset',
    dependencies: [
        BaseExtension,
        FormatStateExtension,
        FocusManagerExtension,
        ListExtension,
        CheckListExtension,
        HorizontalRuleExtension,
        EditorLinkExtension,
        EditorCodeExtension,
        EditorTableExtension,
        ImageExtension,
        LayoutExtension,
        HashtagExtension,
        MentionExtension,
        OverflowExtension,
        EditorShortcutsExtension,
        MarkdownShortcutsExtension,
    ],
});

export { RichTextEditorExtension };
