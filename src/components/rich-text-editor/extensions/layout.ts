import { $findMatchingParent, $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils';
import type { LexicalNode, NodeKey } from 'lexical';
import {
    $createParagraphNode,
    $getNodeByKey,
    $getSelection,
    $isElementNode,
    $isParagraphNode,
    $isRangeSelection,
    $isRootOrShadowRoot,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_LOW,
    createCommand,
    defineExtension,
    KEY_ARROW_DOWN_COMMAND,
    KEY_ARROW_LEFT_COMMAND,
    KEY_ARROW_RIGHT_COMMAND,
    KEY_ARROW_UP_COMMAND,
} from 'lexical';

import {
    $createLayoutContainerNode,
    $isLayoutContainerNode,
    getColumnCount,
    LayoutContainerNode,
} from '@/components/rich-text-editor/nodes/layout-container-node';
import {
    $createLayoutItemNode,
    $isLayoutItemNode,
    LayoutItemNode,
} from '@/components/rich-text-editor/nodes/layout-item-node';

type UpdateLayoutPayload = {
    nodeKey: NodeKey;
    template: string;
};

const INSERT_LAYOUT_COMMAND = createCommand<string>('INSERT_LAYOUT_COMMAND');
const UPDATE_LAYOUT_COMMAND = createCommand<UpdateLayoutPayload>('UPDATE_LAYOUT_COMMAND');

function $createLayoutItemWithParagraph() {
    return $createLayoutItemNode().append($createParagraphNode());
}

function $insertLayout(template: string) {
    const container = $createLayoutContainerNode(template);
    const count = getColumnCount(container.getTemplateColumns());
    for (let index = 0; index < count; index++) container.append($createLayoutItemWithParagraph());

    const selection = $getSelection();
    const block = $isRangeSelection(selection) ? selection.anchor.getNode().getTopLevelElement() : null;
    if ($isParagraphNode(block) && block.isEmpty()) {
        block.replace(container);
    } else {
        $insertNodeToNearestRoot(container);
    }

    container.selectStart();
}

function $updateLayout({ nodeKey, template }: UpdateLayoutPayload) {
    const container = $getNodeByKey(nodeKey);
    if (!$isLayoutContainerNode(container)) return;

    const count = getColumnCount(template);
    const prevCount = container.getChildrenSize();

    for (let index = prevCount; index < count; index++) container.append($createLayoutItemWithParagraph());
    for (let index = prevCount - 1; index >= count; index--) container.getChildAtIndex(index)?.remove();

    container.setTemplateColumns(template);
}

function $escapeLayout(event: KeyboardEvent | null, before: boolean) {
    const selection = $getSelection();
    if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;

    const { anchor } = selection;
    const container = $findMatchingParent(anchor.getNode(), $isLayoutContainerNode);
    if (!container) return false;

    const parent = container.getParent();
    const sibling = before ? container.getPreviousSibling() : container.getNextSibling();
    if (!$isRootOrShadowRoot(parent) || sibling !== null) return false;

    const edge = before ? container.getFirstDescendant() : container.getLastDescendant();
    if (!edge || anchor.key !== edge.getKey()) return false;

    const edgeOffset = before ? 0 : $isElementNode(edge) ? edge.getChildrenSize() : edge.getTextContentSize();
    if (anchor.offset !== edgeOffset) return false;

    const paragraph = $createParagraphNode();
    if (before) {
        container.insertBefore(paragraph);
    } else {
        container.insertAfter(paragraph);
    }
    paragraph.select();
    event?.preventDefault();

    return true;
}

function $unwrap(node: LayoutContainerNode | LayoutItemNode) {
    for (const child of node.getChildren<LexicalNode>()) node.insertBefore(child);
    node.remove();
}

function $normalizeLayoutItem(node: LayoutItemNode) {
    if (!$isLayoutContainerNode(node.getParent())) {
        $unwrap(node);
        return;
    }

    if (node.isEmpty()) node.append($createParagraphNode());
}

function $normalizeLayoutContainer(node: LayoutContainerNode) {
    if (node.isEmpty()) {
        node.remove();
        return;
    }

    if (!node.getChildren().every($isLayoutItemNode)) $unwrap(node);
}

const LayoutExtension = defineExtension({
    name: '@rich-text-editor/layout',
    nodes: () => [LayoutContainerNode, LayoutItemNode],
    register: (editor) =>
        mergeRegister(
            editor.registerCommand(
                INSERT_LAYOUT_COMMAND,
                (template) => {
                    $insertLayout(template);
                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),
            editor.registerCommand(
                UPDATE_LAYOUT_COMMAND,
                (payload) => {
                    $updateLayout(payload);
                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            ),
            editor.registerCommand(KEY_ARROW_UP_COMMAND, (event) => $escapeLayout(event, true), COMMAND_PRIORITY_LOW),
            editor.registerCommand(KEY_ARROW_LEFT_COMMAND, (event) => $escapeLayout(event, true), COMMAND_PRIORITY_LOW),
            editor.registerCommand(
                KEY_ARROW_DOWN_COMMAND,
                (event) => $escapeLayout(event, false),
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_ARROW_RIGHT_COMMAND,
                (event) => $escapeLayout(event, false),
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerNodeTransform(LayoutItemNode, $normalizeLayoutItem),
            editor.registerNodeTransform(LayoutContainerNode, $normalizeLayoutContainer),
        ),
});

export type { UpdateLayoutPayload };
export { $insertLayout, INSERT_LAYOUT_COMMAND, LayoutExtension, UPDATE_LAYOUT_COMMAND };
