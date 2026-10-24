import { $createCodeNode, CodeIndentExtension } from '@lexical/code';
import { CodePrismExtension } from '@lexical/code-prism';
import { $setBlocksType } from '@lexical/selection';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { $getSelection, $isParagraphNode, $isRangeSelection, configExtension, defineExtension } from 'lexical';

import { CODE_TAB_SIZE } from '@/components/rich-text-editor/constants';

function $setCodeBlock() {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    if (selection.isCollapsed()) {
        $setBlocksType(selection, () => $createCodeNode());
        return;
    }

    const text = selection.getTextContent();
    selection.insertNodes([$createCodeNode()]);

    const next = $getSelection();
    if ($isRangeSelection(next)) next.insertRawText(text);
}

function $insertCodeBlock() {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const block = selection.anchor.getNode().getTopLevelElement();
    if ($isParagraphNode(block) && block.isEmpty()) {
        $setBlocksType(selection, () => $createCodeNode());
        return;
    }

    $insertNodeToNearestRoot($createCodeNode()).selectStart();
}

const EditorCodeExtension = defineExtension({
    name: '@rich-text-editor/code',
    dependencies: [
        CodePrismExtension,
        configExtension(CodeIndentExtension, { tabSize: CODE_TAB_SIZE, escapeWithArrows: true }),
    ],
});

export { $insertCodeBlock, $setCodeBlock, EditorCodeExtension };
