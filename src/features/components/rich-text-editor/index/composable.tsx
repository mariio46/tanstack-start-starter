import { FocusManagerExtension } from '@lexical/a11y';
import { HorizontalRuleExtension } from '@lexical/extension';
import { CheckListExtension, ListExtension } from '@lexical/list';
import { defineExtension } from 'lexical';

import { EditorContent } from '@/components/rich-text-editor/editor-content';
import { EditorRoot } from '@/components/rich-text-editor/editor-root';
import { BaseExtension } from '@/components/rich-text-editor/extensions/base';
import { FormatStateExtension } from '@/components/rich-text-editor/extensions/format-state';
import { ImageExtension } from '@/components/rich-text-editor/extensions/image';
import { EditorLinkExtension } from '@/components/rich-text-editor/extensions/link';
import { MarkdownShortcutsExtension } from '@/components/rich-text-editor/extensions/markdown';
import { DraggableBlockPlugin } from '@/components/rich-text-editor/plugins/draggable-block-plugin';
import { LinkEditorPlugin } from '@/components/rich-text-editor/plugins/floating/link-editor-plugin';
import { TextFormatFloatingPlugin } from '@/components/rich-text-editor/plugins/floating/text-format-floating-plugin';
import { ImagePlugin } from '@/components/rich-text-editor/plugins/image-plugin';
import { BasicSlashItems } from '@/components/rich-text-editor/plugins/slash-menu/basic-slash-items';
import { EditorSlashMenu } from '@/components/rich-text-editor/plugins/slash-menu/editor-slash-menu';
import { MediaSlashItems } from '@/components/rich-text-editor/plugins/slash-menu/media-slash-items';
import { EditorToolbar } from '@/components/rich-text-editor/plugins/toolbar/editor-toolbar';
import { HistoryToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/history-toolbar-plugin';
import { LinkToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/link-toolbar-plugin';
import { TextFormatToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/text-format-toolbar-plugin';
import { ValuePlugin } from '@/components/rich-text-editor/plugins/value-plugin';
import { ToolbarSeparator } from '@/components/ui/toolbar';

import { COMPOSABLE_BLOCK_VALUE, COMPOSABLE_MINIMAL_VALUE } from './constants';

const MinimalEditorExtension = defineExtension({
    name: '@rich-text-editor/example-minimal',
    dependencies: [BaseExtension, FormatStateExtension, FocusManagerExtension, EditorLinkExtension],
});

const BlockEditorExtension = defineExtension({
    name: '@rich-text-editor/example-block',
    dependencies: [
        BaseExtension,
        FormatStateExtension,
        ListExtension,
        CheckListExtension,
        HorizontalRuleExtension,
        EditorLinkExtension,
        ImageExtension,
        MarkdownShortcutsExtension,
    ],
});

const MinimalEditor = () => {
    return (
        <EditorRoot extension={MinimalEditorExtension}>
            <EditorToolbar>
                <HistoryToolbarPlugin />
                <ToolbarSeparator orientation='vertical' />
                <TextFormatToolbarPlugin />
                <LinkToolbarPlugin />
            </EditorToolbar>
            <EditorContent placeholder='Tulis komentar…' aria-label='Komentar' className='min-h-24' />
            <LinkEditorPlugin />
            <ValuePlugin defaultValue={COMPOSABLE_MINIMAL_VALUE} />
        </EditorRoot>
    );
};

const BlockEditor = () => {
    return (
        <EditorRoot extension={BlockEditorExtension}>
            <EditorContent variant='draggable' placeholder='Tekan "/" untuk blok…' aria-label='Halaman' />
            <EditorSlashMenu variant='detailed'>
                <BasicSlashItems />
                <MediaSlashItems />
            </EditorSlashMenu>
            <DraggableBlockPlugin />
            <TextFormatFloatingPlugin />
            <LinkEditorPlugin />
            <ImagePlugin />
            <ValuePlugin defaultValue={COMPOSABLE_BLOCK_VALUE} />
        </EditorRoot>
    );
};

const ComposableRichTextEditor = () => {
    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <div className='grid min-w-0 content-start gap-2'>
                <span className='font-medium text-sm/4'>Minimal</span>
                <MinimalEditor />
                <p className='text-muted-foreground text-sm'>History, format teks, dan link — tanpa activity bar.</p>
            </div>
            <div className='grid min-w-0 content-start gap-2'>
                <span className='font-medium text-sm/4'>Block editor</span>
                <BlockEditor />
                <p className='text-muted-foreground text-sm'>
                    Tanpa toolbar: slash menu, handle seret, dan toolbar mengambang yang mengerjakan semuanya.
                </p>
            </div>
        </div>
    );
};

export { ComposableRichTextEditor };
