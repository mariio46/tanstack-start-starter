import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    NodeContextMenuOption,
    NodeContextMenuPlugin,
    NodeContextMenuSeparator,
} from '@lexical/react/LexicalNodeContextMenuPlugin';
import { $findMatchingParent } from '@lexical/utils';
import { IconClipboard, IconClipboardText, IconCopy, IconScissors, IconTrash } from '@tabler/icons-react';
import type { LexicalEditor } from 'lexical';
import {
    $getSelection,
    $isNodeSelection,
    $isRangeSelection,
    $isRootOrShadowRoot,
    COPY_COMMAND,
    CUT_COMMAND,
    PASTE_COMMAND,
} from 'lexical';

import { useFormatState } from '@/components/rich-text-editor/plugins/toolbar/editor-toolbar';

const MENU_CLASS_NAME =
    'z-50 flex min-w-44 flex-col rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none';
const ITEM_CLASS_NAME =
    "flex cursor-default select-none items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-sm outline-hidden hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0";
const SEPARATOR_CLASS_NAME = '-mx-1 my-1 h-px border-0 bg-border';

async function readClipboard(plain: boolean) {
    const data = new DataTransfer();

    if (!plain && 'read' in navigator.clipboard) {
        try {
            const [item] = await navigator.clipboard.read();
            for (const type of item?.types ?? []) {
                const blob = await item.getType(type);
                if (type.startsWith('image/')) data.items.add(new File([blob], 'image', { type }));
                else data.setData(type, await blob.text());
            }
            return data;
        } catch {}
    }

    data.setData('text/plain', await navigator.clipboard.readText());
    return data;
}

function paste(editor: LexicalEditor, plain: boolean) {
    readClipboard(plain)
        .then((data) => {
            const event = new ClipboardEvent('paste', { clipboardData: data });
            editor.focus(() => editor.dispatchCommand(PASTE_COMMAND, event));
        })
        .catch(() => editor.focus());
}

function $deleteBlock() {
    const selection = $getSelection();

    if ($isNodeSelection(selection)) {
        for (const node of selection.getNodes()) node.remove();
        return;
    }

    if (!$isRangeSelection(selection)) return;

    const block = $findMatchingParent(selection.anchor.getNode(), (node) => {
        const parent = node.getParent();
        return parent !== null && $isRootOrShadowRoot(parent);
    });
    block?.remove();
}

function ContextMenuPlugin() {
    const [editor] = useLexicalComposerContext();
    const { isEditable } = useFormatState();

    const focusRoot = () => editor.getRootElement()?.focus({ preventScroll: true });

    const items = [
        new NodeContextMenuOption('Potong', {
            icon: <IconScissors />,
            $onSelect: () => {
                focusRoot();
                editor.dispatchCommand(CUT_COMMAND, null);
            },
        }),
        new NodeContextMenuOption('Salin', {
            icon: <IconCopy />,
            $onSelect: () => {
                focusRoot();
                editor.dispatchCommand(COPY_COMMAND, null);
            },
        }),
        new NodeContextMenuOption('Tempel', {
            icon: <IconClipboard />,
            $onSelect: () => paste(editor, false),
        }),
        new NodeContextMenuOption('Tempel sebagai teks biasa', {
            icon: <IconClipboardText />,
            $onSelect: () => paste(editor, true),
        }),
        new NodeContextMenuSeparator(),
        new NodeContextMenuOption('Hapus blok', {
            icon: <IconTrash />,
            $onSelect: $deleteBlock,
        }),
    ];

    if (!isEditable) return null;

    return (
        <NodeContextMenuPlugin
            label='Aksi blok'
            items={items}
            className={MENU_CLASS_NAME}
            itemClassName={ITEM_CLASS_NAME}
            separatorClassName={SEPARATOR_CLASS_NAME}
        />
    );
}

export { ContextMenuPlugin };
