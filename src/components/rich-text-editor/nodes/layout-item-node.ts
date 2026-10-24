import type { DOMConversionOutput, EditorConfig, LexicalNode } from 'lexical';
import {
    $applyNodeReplacement,
    $createParagraphNode,
    $getDocument,
    $isElementNode,
    $isParagraphNode,
    addClassNamesToElement,
    ElementNode,
} from 'lexical';

import { $isLayoutContainerNode } from './layout-container-node';

class LayoutItemNode extends ElementNode {
    $config() {
        return this.config('layout-item', {
            extends: ElementNode,
            importDOM: {
                div: (domNode: HTMLElement) =>
                    domNode.hasAttribute('data-lexical-layout-item')
                        ? { conversion: $convertLayoutItemElement, priority: 2 }
                        : null,
            },
        });
    }

    createDOM(config: EditorConfig): HTMLElement {
        const element = $getDocument().createElement('div');
        element.setAttribute('data-lexical-layout-item', 'true');
        addClassNamesToElement(element, config.theme.layoutItem);

        return element;
    }

    updateDOM(): false {
        return false;
    }

    isShadowRoot(): true {
        return true;
    }

    canBeEmpty(): false {
        return false;
    }

    canIndent(): false {
        return false;
    }

    collapseAtStart(): boolean {
        const container = this.getParent();
        if (!$isLayoutContainerNode(container) || !this.is(container.getFirstChild())) return false;
        if (!container.getChildren().every($isEmptyLayoutItem)) return false;

        const paragraph = $createParagraphNode();
        container.replace(paragraph);
        paragraph.select();

        return true;
    }
}

function $isEmptyLayoutItem(node: LexicalNode) {
    if (!$isElementNode(node) || node.getChildrenSize() > 1) return false;

    const child = node.getFirstChild();
    return child === null || ($isParagraphNode(child) && child.isEmpty());
}

function $convertLayoutItemElement(): DOMConversionOutput {
    return { node: $createLayoutItemNode() };
}

function $createLayoutItemNode() {
    return $applyNodeReplacement(new LayoutItemNode());
}

function $isLayoutItemNode(node: LexicalNode | null | undefined): node is LayoutItemNode {
    return node instanceof LayoutItemNode;
}

export { $createLayoutItemNode, $isLayoutItemNode, LayoutItemNode };
