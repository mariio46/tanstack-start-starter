import { $isCodeNode } from '@lexical/code';
import type { Signal } from '@lexical/extension';
import { signal } from '@lexical/extension';
import { $isListNode, ListNode } from '@lexical/list';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { $findTableNode } from '@lexical/table';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import type { ElementFormatType, LexicalEditor, TextFormatType } from 'lexical';
import {
    $getSelection,
    $isElementNode,
    $isRangeSelection,
    $isRootOrShadowRoot,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    defineExtension,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';

import { $isActiveLinkNode } from '@/components/rich-text-editor/extensions/link';

type BlockType =
    | 'paragraph'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'bullet'
    | 'number'
    | 'check'
    | 'quote'
    | 'code';

type FormatState = {
    blockType: BlockType;
    formats: Record<TextFormatType, boolean>;
    fontFamily: string;
    fontSize: string;
    color: string;
    backgroundColor: string;
    elementFormat: ElementFormatType;
    isLink: boolean;
    isInTable: boolean;
    canUndo: boolean;
    canRedo: boolean;
    isEditable: boolean;
};

const TEXT_FORMATS: TextFormatType[] = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'code',
    'subscript',
    'superscript',
    'highlight',
    'lowercase',
    'uppercase',
    'capitalize',
];

const DEFAULT_FORMAT_STATE: FormatState = {
    blockType: 'paragraph',
    formats: {
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        code: false,
        subscript: false,
        superscript: false,
        highlight: false,
        lowercase: false,
        uppercase: false,
        capitalize: false,
    },
    fontFamily: '',
    fontSize: '',
    color: '',
    backgroundColor: '',
    elementFormat: '',
    isLink: false,
    isInTable: false,
    canUndo: false,
    canRedo: false,
    isEditable: true,
};

function isSameState(a: FormatState, b: FormatState) {
    return (Object.keys(a) as (keyof FormatState)[]).every((key) => {
        if (key === 'formats') return TEXT_FORMATS.every((format) => a.formats[format] === b.formats[format]);

        return a[key] === b[key];
    });
}

function $readSelectionState(): Partial<FormatState> | null {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return null;

    const anchorNode = selection.anchor.getNode();
    const block =
        anchorNode.getKey() === 'root'
            ? anchorNode
            : ($findMatchingParent(anchorNode, (node) => {
                  const parent = node.getParent();
                  return parent !== null && $isRootOrShadowRoot(parent);
              }) ?? anchorNode.getTopLevelElementOrThrow());

    let blockType: BlockType = 'paragraph';
    if ($isListNode(block)) {
        const list = $getNearestNodeOfType(anchorNode, ListNode) ?? block;
        blockType = list.getListType();
    } else if ($isHeadingNode(block)) {
        blockType = block.getTag();
    } else if ($isQuoteNode(block)) {
        blockType = 'quote';
    } else if ($isCodeNode(block)) {
        blockType = 'code';
    }

    const formats = { ...DEFAULT_FORMAT_STATE.formats };
    for (const format of TEXT_FORMATS) formats[format] = selection.hasFormat(format);

    const formatParent = $findMatchingParent(
        anchorNode,
        (node) => $isElementNode(node) && !node.isInline() && !$isRootOrShadowRoot(node),
    );
    const elementFormat = $isElementNode(formatParent) ? formatParent.getFormatType() : '';

    const focusNode = selection.focus.getNode();
    const isLink =
        $findMatchingParent(anchorNode, $isActiveLinkNode) !== null ||
        $findMatchingParent(focusNode, $isActiveLinkNode) !== null;

    return {
        blockType,
        formats,
        fontFamily: $getSelectionStyleValueForProperty(selection, 'font-family', ''),
        fontSize: $getSelectionStyleValueForProperty(selection, 'font-size', ''),
        color: $getSelectionStyleValueForProperty(selection, 'color', ''),
        backgroundColor: $getSelectionStyleValueForProperty(selection, 'background-color', ''),
        elementFormat,
        isLink,
        isInTable: $findTableNode(anchorNode) !== null,
    };
}

function registerFormatState(editor: LexicalEditor, state: Signal<FormatState>) {
    const patch = (next: Partial<FormatState>) => {
        const merged = { ...state.peek(), ...next };
        if (!isSameState(state.peek(), merged)) state.value = merged;
    };

    const readSelection = () => {
        const next = editor.getEditorState().read(() => $readSelectionState(), { editor });
        if (next) patch(next);
    };

    patch({ isEditable: editor.isEditable() });
    readSelection();

    return mergeRegister(
        editor.registerUpdateListener(readSelection),
        editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                readSelection();
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        ),
        editor.registerCommand(
            CAN_UNDO_COMMAND,
            (payload) => {
                patch({ canUndo: payload });
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        ),
        editor.registerCommand(
            CAN_REDO_COMMAND,
            (payload) => {
                patch({ canRedo: payload });
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        ),
        editor.registerEditableListener((isEditable) => patch({ isEditable: isEditable })),
    );
}

const FormatStateExtension = defineExtension({
    name: '@rich-text-editor/format-state',
    build: () => ({ state: signal<FormatState>(DEFAULT_FORMAT_STATE) }),
    register: (editor, _config, { getOutput }) => registerFormatState(editor, getOutput().state),
});

export type { BlockType, FormatState };
export { DEFAULT_FORMAT_STATE, FormatStateExtension };
