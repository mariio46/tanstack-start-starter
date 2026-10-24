import type { LinkNode } from '@lexical/link';
import {
    $createLinkNode,
    $isAutoLinkNode,
    $isLinkNode,
    $toggleLink,
    AutoLinkExtension,
    ClickableLinkExtension,
    LinkExtension,
} from '@lexical/link';
import { IS_APPLE, mergeRegister } from '@lexical/utils';
import type { LexicalNode } from 'lexical';
import {
    $createTextNode,
    $findMatchingParent,
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_NORMAL,
    configExtension,
    createCommand,
    defineExtension,
    isExactShortcutMatch,
    KEY_DOWN_COMMAND,
    registerEventListeners,
} from 'lexical';

import { AUTO_LINK_MATCHERS, LINK_PROTOCOLS } from '@/components/rich-text-editor/constants';

const OPEN_LINK_EDITOR_COMMAND = createCommand<void>('OPEN_LINK_EDITOR_COMMAND');

function isValidLinkUrl(url: string) {
    try {
        return LINK_PROTOCOLS.includes(new URL(url).protocol);
    } catch {
        return false;
    }
}

function $isActiveLinkNode(node: LexicalNode | null | undefined): node is LinkNode {
    return $isLinkNode(node) && !($isAutoLinkNode(node) && node.getIsUnlinked());
}

function $getSelectedLinkNode(): LinkNode | null {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return null;

    const anchorLink = $findMatchingParent(selection.anchor.getNode(), $isActiveLinkNode);
    const focusLink = $findMatchingParent(selection.focus.getNode(), $isActiveLinkNode);

    return anchorLink !== null && anchorLink.is(focusLink) ? anchorLink : null;
}

function $removeLink(link: LinkNode) {
    if ($isAutoLinkNode(link)) {
        link.setIsUnlinked(true);
        return;
    }

    for (const child of link.getChildren()) link.insertBefore(child);
    link.remove();
}

function $setLinkUrl(link: LinkNode, url: string) {
    if ($isAutoLinkNode(link)) {
        link.replace($createLinkNode(url), true);
        return;
    }

    link.setURL(url);
}

function $insertLink(url: string) {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    if (selection.isCollapsed()) {
        const link = $createLinkNode(url);
        link.append($createTextNode(url.replace(/^(mailto|tel):/, '')));
        selection.insertNodes([link]);
        return;
    }

    $toggleLink(url);
}

function $unlinkSelection() {
    const link = $getSelectedLinkNode();
    if (link) {
        $removeLink(link);
        return;
    }

    $toggleLink(null);
}

const EditorLinkExtension = defineExtension({
    name: '@rich-text-editor/link',
    dependencies: [
        configExtension(LinkExtension, { validateUrl: isValidLinkUrl }),
        configExtension(AutoLinkExtension, { matchers: AUTO_LINK_MATCHERS }),
        configExtension(ClickableLinkExtension, { newTab: true }),
    ],
    register: (editor, _config, state) => {
        const { disabled } = state.getDependency(ClickableLinkExtension).output;

        const syncClickable = (event: MouseEvent) => {
            disabled.value = editor.isEditable() && !(event.metaKey || event.ctrlKey) && event.button !== 1;
        };

        return mergeRegister(
            editor.registerRootListener((root) => {
                if (root) return registerEventListeners(root, { click: syncClickable, auxclick: syncClickable }, true);
            }),
            editor.registerCommand(
                KEY_DOWN_COMMAND,
                (event) => {
                    if (!isExactShortcutMatch(event, 'k', IS_APPLE ? { metaKey: true } : { ctrlKey: true })) {
                        return false;
                    }
                    if (!editor.isEditable()) return false;

                    event.preventDefault();
                    return editor.dispatchCommand(OPEN_LINK_EDITOR_COMMAND, undefined);
                },
                COMMAND_PRIORITY_NORMAL,
            ),
        );
    },
});

export {
    $getSelectedLinkNode,
    $insertLink,
    $isActiveLinkNode,
    $removeLink,
    $setLinkUrl,
    $unlinkSelection,
    EditorLinkExtension,
    isValidLinkUrl,
    OPEN_LINK_EDITOR_COMMAND,
};
