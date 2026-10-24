type RichTextNode = {
    type: string;
    text?: string;
    children?: RichTextNode[];
    [key: string]: unknown;
};

type RichTextDocument = {
    root: RichTextNode & { children: RichTextNode[] };
};

const INLINE_ELEMENT_TYPES = new Set(['link', 'autolink', 'overflow', 'mark']);

const BLANK_LEAF_TYPES = new Set(['text', 'linebreak', 'tab']);

function isNode(value: unknown): value is RichTextNode {
    return typeof value === 'object' && value !== null && typeof (value as RichTextNode).type === 'string';
}

function parseRichText(value: string | null | undefined): RichTextDocument | null {
    if (!value) return null;

    try {
        const parsed: unknown = JSON.parse(value);
        const root = (parsed as { root?: unknown } | null)?.root;

        if (!isNode(root) || !Array.isArray(root.children)) return null;

        return parsed as RichTextDocument;
    } catch {
        return null;
    }
}

function isBlock(node: RichTextNode) {
    return Array.isArray(node.children) && !INLINE_ELEMENT_TYPES.has(node.type);
}

function getNodeText(node: RichTextNode): string {
    if (node.type === 'linebreak') return '\n';
    if (node.type === 'tab') return '\t';
    if (typeof node.text === 'string') return node.text;
    if (!Array.isArray(node.children)) return '';

    const children = node.children.filter(isNode);

    return children
        .map((child, index) => {
            const text = getNodeText(child);
            const isLast = index === children.length - 1;

            return isBlock(child) && !isLast ? `${text}\n\n` : text;
        })
        .join('');
}

function getRichTextContent(value: string | null | undefined) {
    const document = parseRichText(value);

    return document ? getNodeText(document.root) : '';
}

function getRichTextLength(value: string | null | undefined) {
    return getRichTextContent(value).length;
}

function isBlankNode(node: RichTextNode): boolean {
    if (BLANK_LEAF_TYPES.has(node.type)) return (node.text ?? '').trim() === '';
    if (!Array.isArray(node.children)) return false;

    return node.children.every((child) => isNode(child) && BLANK_LEAF_TYPES.has(child.type) && isBlankNode(child));
}

function isRichTextEmpty(value: string | null | undefined) {
    const document = parseRichText(value);

    if (!document) return true;

    return document.root.children.every((child) => isNode(child) && isBlankNode(child));
}

export type { RichTextDocument, RichTextNode };
export { getRichTextContent, getRichTextLength, isRichTextEmpty, parseRichText };
