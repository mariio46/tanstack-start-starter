import type * as React from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';

import { EditorContent } from '@/components/rich-text-editor/editor-content';
import type { EditorMentions } from '@/components/rich-text-editor/editor-root';
import { EditorRoot } from '@/components/rich-text-editor/editor-root';
import { RichTextEditorExtension } from '@/components/rich-text-editor/extension';
import { CountPlugin } from '@/components/rich-text-editor/plugins/activity-bar/count-plugin';
import {
    EditorActivityBar,
    EditorActivityBarGroup,
} from '@/components/rich-text-editor/plugins/activity-bar/editor-activity-bar';
import { ReadOnlyTogglePlugin } from '@/components/rich-text-editor/plugins/activity-bar/read-only-toggle-plugin';
import { ShortcutsPlugin } from '@/components/rich-text-editor/plugins/activity-bar/shortcuts-plugin';
import { SpeechToTextPlugin } from '@/components/rich-text-editor/plugins/activity-bar/speech-to-text-plugin';
import { CharacterLimitPlugin } from '@/components/rich-text-editor/plugins/character-limit-plugin';
import { ContextMenuPlugin } from '@/components/rich-text-editor/plugins/context-menu-plugin';
import { DraggableBlockPlugin } from '@/components/rich-text-editor/plugins/draggable-block-plugin';
import { EmojiPlugin } from '@/components/rich-text-editor/plugins/emoji-plugin';
import { CodeActionPlugin } from '@/components/rich-text-editor/plugins/floating/code-action-plugin';
import { LinkEditorPlugin } from '@/components/rich-text-editor/plugins/floating/link-editor-plugin';
import { TableActionPlugin } from '@/components/rich-text-editor/plugins/floating/table-action-plugin';
import { TableCellResizerPlugin } from '@/components/rich-text-editor/plugins/floating/table-cell-resizer-plugin';
import { TableHoverActionsPlugin } from '@/components/rich-text-editor/plugins/floating/table-hover-actions-plugin';
import { TextFormatFloatingPlugin } from '@/components/rich-text-editor/plugins/floating/text-format-floating-plugin';
import { ImagePlugin } from '@/components/rich-text-editor/plugins/image-plugin';
import { MentionPlugin } from '@/components/rich-text-editor/plugins/mention-plugin';
import { AdvancedSlashItems } from '@/components/rich-text-editor/plugins/slash-menu/advanced-slash-items';
import { BasicSlashItems } from '@/components/rich-text-editor/plugins/slash-menu/basic-slash-items';
import { EditorSlashMenu } from '@/components/rich-text-editor/plugins/slash-menu/editor-slash-menu';
import { MediaSlashItems } from '@/components/rich-text-editor/plugins/slash-menu/media-slash-items';
import { BlockFormatToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/block-format-toolbar-plugin';
import { ClearToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/clear-toolbar-plugin';
import { ColorToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/color-toolbar-plugin';
import { EditorToolbar } from '@/components/rich-text-editor/plugins/toolbar/editor-toolbar';
import { ElementFormatToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/element-format-toolbar-plugin';
import { EmojiToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/emoji-toolbar-plugin';
import { ExpandToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/expand-toolbar-plugin';
import { FontFamilyToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/font-family-toolbar-plugin';
import { FontSizeToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/font-size-toolbar-plugin';
import { HistoryToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/history-toolbar-plugin';
import { ImportExportToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/import-export-toolbar-plugin';
import { IndentToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/indent-toolbar-plugin';
import { InsertToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/insert-toolbar-plugin';
import { LinkToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/link-toolbar-plugin';
import { MoreFormatToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/more-format-toolbar-plugin';
import { TextFormatToolbarPlugin } from '@/components/rich-text-editor/plugins/toolbar/text-format-toolbar-plugin';
import { ValuePlugin } from '@/components/rich-text-editor/plugins/value-plugin';
import { ToolbarSeparator } from '@/components/ui/toolbar';

interface RichTextEditorProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    autoFocus?: boolean;
    maxLength?: number;
    uploadImage?: (file: File) => Promise<string>;
    mentions?: EditorMentions;
    onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
    className?: string;
    contentClassName?: string;
    id?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    children?: React.ReactNode;
}

function RichTextEditor({
    value,
    defaultValue,
    onValueChange,
    name,
    placeholder = 'Tulis sesuatu, atau tekan "/" untuk perintah…',
    disabled,
    readOnly,
    invalid,
    autoFocus,
    maxLength,
    uploadImage,
    mentions,
    onBlur,
    className,
    contentClassName,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    children,
}: RichTextEditorProps) {
    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;

        onBlur?.(event);
    };

    return (
        <EditorRoot
            extension={RichTextEditorExtension}
            editable={!readOnly}
            disabled={disabled}
            invalid={invalid}
            uploadImage={uploadImage}
            mentions={mentions}
            maxLength={maxLength}
            className={className}
            onBlur={handleBlur}
        >
            <EditorToolbar>
                <HistoryToolbarPlugin />
                <ToolbarSeparator orientation='vertical' />
                <BlockFormatToolbarPlugin />
                <ToolbarSeparator orientation='vertical' />
                <FontFamilyToolbarPlugin />
                <FontSizeToolbarPlugin />
                <ToolbarSeparator orientation='vertical' />
                <TextFormatToolbarPlugin />
                <LinkToolbarPlugin />
                <MoreFormatToolbarPlugin />
                <ColorToolbarPlugin />
                <ToolbarSeparator orientation='vertical' />
                <ElementFormatToolbarPlugin />
                <IndentToolbarPlugin />
                <ToolbarSeparator orientation='vertical' />
                <EmojiToolbarPlugin />
                <InsertToolbarPlugin />
                <ToolbarSeparator orientation='vertical' />
                <ImportExportToolbarPlugin />
                <ClearToolbarPlugin />
                <ToolbarSeparator orientation='vertical' />
                <ExpandToolbarPlugin />
            </EditorToolbar>
            <EditorContent
                variant='draggable'
                placeholder={placeholder}
                className={contentClassName}
                id={id}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
            />
            <EditorActivityBar>
                <CountPlugin />
                <EditorActivityBarGroup>
                    <SpeechToTextPlugin />
                    <ReadOnlyTogglePlugin />
                    <ShortcutsPlugin />
                </EditorActivityBarGroup>
            </EditorActivityBar>
            <EditorSlashMenu variant='detailed'>
                <BasicSlashItems />
                <MediaSlashItems />
                <AdvancedSlashItems />
            </EditorSlashMenu>
            <TextFormatFloatingPlugin />
            <LinkEditorPlugin />
            <CodeActionPlugin />
            <TableActionPlugin />
            <TableCellResizerPlugin />
            <TableHoverActionsPlugin />
            <DraggableBlockPlugin />
            <ContextMenuPlugin />
            <ImagePlugin />
            <MentionPlugin />
            <EmojiPlugin />
            <CharacterLimitPlugin />
            <ValuePlugin value={value} defaultValue={defaultValue} onValueChange={onValueChange} name={name} />
            {autoFocus && <AutoFocusPlugin />}
            {children}
        </EditorRoot>
    );
}

export type { MentionItem } from '@/components/rich-text-editor/editor-root';

export type { RichTextEditorProps };
export { RichTextEditor };
