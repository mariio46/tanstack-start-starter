import type {
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalNode,
    LexicalParseJSON,
    NodeKey,
    SerializedElementNode,
    Spread,
} from 'lexical';
import { $applyNodeReplacement, $getDocument, addClassNamesToElement, ElementNode } from 'lexical';

import { COLUMN_LAYOUTS } from '@/components/rich-text-editor/constants';

type SerializedLayoutContainerNode = Spread<{ template_columns: string }, SerializedElementNode>;

const DEFAULT_TEMPLATE_COLUMNS = COLUMN_LAYOUTS[0].value;

const TEMPLATE_COLUMNS_PATTERN = /^\d+(\.\d+)?fr( \d+(\.\d+)?fr)*$/;

function parseTemplateColumns(value: unknown) {
    const template = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';

    return TEMPLATE_COLUMNS_PATTERN.test(template) ? template : DEFAULT_TEMPLATE_COLUMNS;
}

function getColumnCount(templateColumns: string) {
    return parseTemplateColumns(templateColumns).split(' ').length;
}

class LayoutContainerNode extends ElementNode {
    __templateColumns: string;

    $config() {
        return this.config('layout-container', {
            extends: ElementNode,
            importDOM: {
                div: (domNode: HTMLElement) =>
                    domNode.hasAttribute('data-lexical-layout-container')
                        ? { conversion: $convertLayoutContainerElement, priority: 2 }
                        : null,
            },
        });
    }

    constructor(templateColumns: string = DEFAULT_TEMPLATE_COLUMNS, key?: NodeKey) {
        super(key);
        this.__templateColumns = templateColumns;
    }

    afterCloneFrom(prevNode: this) {
        super.afterCloneFrom(prevNode);
        this.__templateColumns = prevNode.__templateColumns;
    }

    updateFromJSON(serializedNode: LexicalParseJSON<SerializedLayoutContainerNode>): this {
        return super.updateFromJSON(serializedNode).setTemplateColumns(serializedNode.template_columns);
    }

    exportJSON(): SerializedLayoutContainerNode {
        return { ...super.exportJSON(), template_columns: this.getTemplateColumns() };
    }

    exportDOM(): DOMExportOutput {
        const element = $getDocument().createElement('div');
        element.setAttribute('data-lexical-layout-container', 'true');
        element.style.display = 'grid';
        element.style.gridTemplateColumns = this.getTemplateColumns();

        return { element };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const element = $getDocument().createElement('div');
        element.setAttribute('data-lexical-layout-container', 'true');
        element.style.gridTemplateColumns = this.__templateColumns;
        addClassNamesToElement(element, config.theme.layoutContainer);

        return element;
    }

    updateDOM(prevNode: this, dom: HTMLElement): boolean {
        if (prevNode.__templateColumns !== this.__templateColumns) {
            dom.style.gridTemplateColumns = this.__templateColumns;
        }

        return false;
    }

    getTemplateColumns() {
        return this.getLatest().__templateColumns;
    }

    setTemplateColumns(templateColumns: unknown): this {
        const node = this.getWritable();
        node.__templateColumns = parseTemplateColumns(templateColumns);

        return node;
    }

    canBeEmpty(): false {
        return false;
    }

    canIndent(): false {
        return false;
    }
}

function $convertLayoutContainerElement(domNode: HTMLElement): DOMConversionOutput {
    return { node: $createLayoutContainerNode(domNode.style.gridTemplateColumns) };
}

function $createLayoutContainerNode(templateColumns?: string) {
    return $applyNodeReplacement(new LayoutContainerNode(parseTemplateColumns(templateColumns)));
}

function $isLayoutContainerNode(node: LexicalNode | null | undefined): node is LayoutContainerNode {
    return node instanceof LayoutContainerNode;
}

export type { SerializedLayoutContainerNode };
export { $createLayoutContainerNode, $isLayoutContainerNode, getColumnCount, LayoutContainerNode };
