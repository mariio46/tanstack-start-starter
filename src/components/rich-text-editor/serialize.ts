import type { EditorState } from 'lexical';
import { $getRoot, $isParagraphNode } from 'lexical';

function $isEditorEmpty() {
    const root = $getRoot();
    const first = root.getFirstChild();

    if (first === null) return true;

    return root.getChildrenSize() === 1 && $isParagraphNode(first) && first.isEmpty();
}

function serializeEditorState(editorState: EditorState) {
    return editorState.read(() => ($isEditorEmpty() ? '' : JSON.stringify(editorState.toJSON())));
}

export { $isEditorEmpty, serializeEditorState };
