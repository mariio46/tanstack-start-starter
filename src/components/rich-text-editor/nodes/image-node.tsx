import type * as React from 'react';

import type {
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalNode,
    LexicalParseJSON,
    NodeKey,
    SerializedLexicalNode,
    Spread,
} from 'lexical';
import { $applyNodeReplacement, $getDocument, addClassNamesToElement, DecoratorNode } from 'lexical';

import { IMAGE_MAX_WIDTH } from '@/components/rich-text-editor/constants';

import { ImageComponent } from './image-component';

type SerializedImageNode = Spread<
    {
        src: string;
        alt_text: string;
        width: number | null;
        height: number | null;
        max_width: number;
    },
    SerializedLexicalNode
>;

type ImagePayload = {
    src: string;
    altText?: string;
    width?: number | null;
    height?: number | null;
    maxWidth?: number;
    key?: NodeKey;
};

function parseDimension(value: unknown): number | null {
    const number = typeof value === 'string' ? Number.parseFloat(value) : value;

    return typeof number === 'number' && Number.isFinite(number) && number > 0 ? Math.round(number) : null;
}

class ImageNode extends DecoratorNode<React.JSX.Element> {
    __src: string;
    __altText: string;
    __width: number | null;
    __height: number | null;
    __maxWidth: number;

    $config() {
        return this.config('image', {
            extends: DecoratorNode,
            importDOM: {
                img: () => ({ conversion: $convertImageElement, priority: 0 }),
            },
        });
    }

    constructor(
        src: string = '',
        altText: string = '',
        width: number | null = null,
        height: number | null = null,
        maxWidth: number = IMAGE_MAX_WIDTH,
        key?: NodeKey,
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width;
        this.__height = height;
        this.__maxWidth = maxWidth;
    }

    afterCloneFrom(prevNode: this) {
        super.afterCloneFrom(prevNode);
        this.__src = prevNode.__src;
        this.__altText = prevNode.__altText;
        this.__width = prevNode.__width;
        this.__height = prevNode.__height;
        this.__maxWidth = prevNode.__maxWidth;
    }

    updateFromJSON(serializedNode: LexicalParseJSON<SerializedImageNode>): this {
        const { src, alt_text, width, height, max_width } = serializedNode;
        const node = super.updateFromJSON(serializedNode).getWritable();

        node.__src = typeof src === 'string' ? src : '';
        node.__altText = typeof alt_text === 'string' ? alt_text : '';
        node.__width = parseDimension(width);
        node.__height = parseDimension(height);
        node.__maxWidth = parseDimension(max_width) ?? IMAGE_MAX_WIDTH;

        return node;
    }

    exportJSON(): SerializedImageNode {
        return {
            ...super.exportJSON(),
            src: this.getSrc(),
            alt_text: this.getAltText(),
            width: this.getWidth(),
            height: this.getHeight(),
            max_width: this.getMaxWidth(),
        };
    }

    exportDOM(): DOMExportOutput {
        const image = $getDocument().createElement('img');
        image.setAttribute('src', this.getSrc());
        image.setAttribute('alt', this.getAltText());

        const width = this.getWidth();
        const height = this.getHeight();
        if (width !== null) image.setAttribute('width', String(width));
        if (height !== null) image.setAttribute('height', String(height));
        image.style.maxWidth = `${this.getMaxWidth()}px`;

        return { element: image };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const element = $getDocument().createElement('span');
        addClassNamesToElement(element, config.theme.image);

        return element;
    }

    updateDOM(): false {
        return false;
    }

    getSrc() {
        return this.getLatest().__src;
    }

    getAltText() {
        return this.getLatest().__altText;
    }

    getWidth() {
        return this.getLatest().__width;
    }

    getHeight() {
        return this.getLatest().__height;
    }

    getMaxWidth() {
        return this.getLatest().__maxWidth;
    }

    setWidthAndHeight(width: number | null, height: number | null): this {
        const node = this.getWritable();
        node.__width = width;
        node.__height = height;

        return node;
    }

    decorate(): React.JSX.Element {
        return (
            <ImageComponent
                nodeKey={this.getKey()}
                src={this.__src}
                altText={this.__altText}
                width={this.__width}
                maxWidth={this.__maxWidth}
            />
        );
    }
}

function $convertImageElement(domNode: Node): DOMConversionOutput | null {
    if (domNode.nodeName !== 'IMG') return null;

    const image = domNode as HTMLImageElement;
    const src = image.getAttribute('src');
    if (!src || src.startsWith('file:///')) return null;

    return {
        node: $createImageNode({
            src,
            altText: image.getAttribute('alt') ?? '',
            width: parseDimension(image.getAttribute('width')),
            height: parseDimension(image.getAttribute('height')),
        }),
    };
}

function $createImageNode({ src, altText = '', width = null, height = null, maxWidth, key }: ImagePayload) {
    return $applyNodeReplacement(new ImageNode(src, altText, width, height, maxWidth, key));
}

function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}

export type { ImagePayload, SerializedImageNode };
export { $createImageNode, $isImageNode, ImageNode };
