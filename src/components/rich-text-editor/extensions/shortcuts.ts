import type { NamedKeyboardShortcuts } from '@lexical/extension';
import { KeyboardShortcutsExtension } from '@lexical/extension';
import { mergeRegister } from '@lexical/utils';
import type { LexicalEditor } from 'lexical';
import {
    COMMAND_PRIORITY_EDITOR,
    configExtension,
    createCommand,
    defineExtension,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
} from 'lexical';

import type { ShortcutId } from '@/components/rich-text-editor/constants';
import { SHORTCUTS } from '@/components/rich-text-editor/constants';
import { formatBlock } from '@/components/rich-text-editor/plugins/toolbar/block-format-toolbar-plugin';
import { $stepFontSize } from '@/components/rich-text-editor/plugins/toolbar/font-size-toolbar-plugin';
import { $clearFormatting } from '@/components/rich-text-editor/plugins/toolbar/more-format-toolbar-plugin';

type ShortcutHandler = (editor: LexicalEditor) => void;

const SHORTCUT_HANDLERS: Partial<Record<ShortcutId, ShortcutHandler>> = {
    strikethrough: (editor) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough'),
    subscript: (editor) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript'),
    superscript: (editor) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript'),
    clear_formatting: () => $clearFormatting(),
    font_size_decrease: () => $stepFontSize(-1),
    font_size_increase: () => $stepFontSize(1),
    paragraph: (editor) => formatBlock(editor, 'paragraph'),
    heading_1: (editor) => formatBlock(editor, 'h1'),
    heading_2: (editor) => formatBlock(editor, 'h2'),
    heading_3: (editor) => formatBlock(editor, 'h3'),
    heading_4: (editor) => formatBlock(editor, 'h4'),
    heading_5: (editor) => formatBlock(editor, 'h5'),
    heading_6: (editor) => formatBlock(editor, 'h6'),
    numbered_list: (editor) => formatBlock(editor, 'number'),
    bulleted_list: (editor) => formatBlock(editor, 'bullet'),
    check_list: (editor) => formatBlock(editor, 'check'),
    code_block: (editor) => formatBlock(editor, 'code'),
    quote: (editor) => formatBlock(editor, 'quote'),
    align_left: (editor) => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left'),
    align_center: (editor) => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center'),
    align_right: (editor) => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right'),
    align_justify: (editor) => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify'),
};

const SHORTCUT_ENTRIES = SHORTCUTS.flatMap((shortcut) => {
    const handler = SHORTCUT_HANDLERS[shortcut.id];
    if (!handler) return [];

    return [{ shortcut, handler, command: createCommand<KeyboardEvent>(`SHORTCUT_${shortcut.id.toUpperCase()}`) }];
});

const NAMED_SHORTCUTS: NamedKeyboardShortcuts = Object.fromEntries(
    SHORTCUT_ENTRIES.map(({ shortcut, command }) => [
        `rich-text-editor/${shortcut.id}`,
        {
            key: shortcut.key,
            modifiers: shortcut.modifiers,
            unshiftedKey: shortcut.unshiftedKey,
            description: shortcut.label,
            command,
            $disabled: (_selection, editor) => !editor.isEditable(),
        },
    ]),
);

const EditorShortcutsExtension = defineExtension({
    name: '@rich-text-editor/shortcuts',
    dependencies: [configExtension(KeyboardShortcutsExtension, { shortcuts: NAMED_SHORTCUTS })],
    register: (editor) =>
        mergeRegister(
            ...SHORTCUT_ENTRIES.map(({ command, handler }) =>
                editor.registerCommand(
                    command,
                    (event) => {
                        event.preventDefault();
                        handler(editor);
                        return true;
                    },
                    COMMAND_PRIORITY_EDITOR,
                ),
            ),
        ),
});

export { EditorShortcutsExtension };
