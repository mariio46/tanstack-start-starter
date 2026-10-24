import { OverflowNode } from '@lexical/overflow';
import { CharacterLimitPlugin as LexicalCharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { useEditorConfig } from '@/components/rich-text-editor/editor-root';

const renderNothing = () => <span hidden />;

function CharacterLimitPlugin() {
    const [editor] = useLexicalComposerContext();
    const { maxLength } = useEditorConfig();

    if (maxLength === undefined || !editor.hasNodes([OverflowNode])) return null;

    return <LexicalCharacterLimitPlugin charset='UTF-16' maxLength={maxLength} renderer={renderNothing} />;
}

export { CharacterLimitPlugin };
