import type {
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalNode,
    LexicalParseJSON,
    NodeKey,
    SerializedTextNode,
    Spread,
} from 'lexical';
import { $applyNodeReplacement, $getDocument, addClassNamesToElement, TextNode } from 'lexical';

type SerializedMentionNode = Spread<{ id: string; mention_name: string }, SerializedTextNode>;

class MentionNode extends TextNode {
    __mentionId: string;
    __mentionName: string;

    $config() {
        return this.config('mention', {
            extends: TextNode,
            importDOM: {
                span: (domNode: HTMLElement) =>
                    domNode.hasAttribute('data-lexical-mention')
                        ? { conversion: $convertMentionElement, priority: 1 }
                        : null,
            },
        });
    }

    constructor(mentionId: string = '', mentionName: string = '', text?: string, key?: NodeKey) {
        super(text ?? `@${mentionName}`, key);
        this.__mentionId = mentionId;
        this.__mentionName = mentionName;
    }

    afterCloneFrom(prevNode: this) {
        super.afterCloneFrom(prevNode);
        this.__mentionId = prevNode.__mentionId;
        this.__mentionName = prevNode.__mentionName;
    }

    updateFromJSON(serializedNode: LexicalParseJSON<SerializedMentionNode>): this {
        const { id, mention_name } = serializedNode;
        const node = super.updateFromJSON(serializedNode).setMode('token').getWritable();

        node.__mentionId = typeof id === 'string' ? id : '';
        node.__mentionName = typeof mention_name === 'string' ? mention_name : '';

        return node;
    }

    exportJSON(): SerializedMentionNode {
        return { ...super.exportJSON(), id: this.getMentionId(), mention_name: this.getMentionName() };
    }

    exportDOM(): DOMExportOutput {
        const element = $getDocument().createElement('span');
        element.setAttribute('data-lexical-mention', 'true');
        element.setAttribute('data-lexical-mention-id', this.getMentionId());
        element.setAttribute('data-lexical-mention-name', this.getMentionName());
        element.textContent = this.getTextContent();

        return { element };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const element = super.createDOM(config);
        addClassNamesToElement(element, config.theme.mention);
        element.spellcheck = false;

        return element;
    }

    getMentionId() {
        return this.getLatest().__mentionId;
    }

    getMentionName() {
        return this.getLatest().__mentionName;
    }

    isTextEntity(): true {
        return true;
    }

    canInsertTextBefore(): false {
        return false;
    }

    canInsertTextAfter(): false {
        return false;
    }
}

function $convertMentionElement(domNode: HTMLElement): DOMConversionOutput | null {
    const name = domNode.getAttribute('data-lexical-mention-name') ?? domNode.textContent?.replace(/^@/, '') ?? '';
    if (!name) return null;

    return { node: $createMentionNode(domNode.getAttribute('data-lexical-mention-id') ?? '', name) };
}

function $createMentionNode(mentionId: string, mentionName: string) {
    return $applyNodeReplacement(new MentionNode(mentionId, mentionName).setMode('token'));
}

function $isMentionNode(node: LexicalNode | null | undefined): node is MentionNode {
    return node instanceof MentionNode;
}

export type { SerializedMentionNode };
export { $createMentionNode, $isMentionNode, MentionNode };
