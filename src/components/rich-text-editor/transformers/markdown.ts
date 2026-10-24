import { $createHorizontalRuleNode, $isHorizontalRuleNode, HorizontalRuleNode } from '@lexical/extension';
import type { ElementTransformer, TextMatchTransformer, Transformer } from '@lexical/markdown';
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    CHECK_LIST,
    ELEMENT_TRANSFORMERS,
    MULTILINE_ELEMENT_TRANSFORMERS,
    TEXT_FORMAT_TRANSFORMERS,
    TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown';
import {
    $createTableCellNode,
    $createTableNode,
    $createTableRowNode,
    $isTableCellNode,
    $isTableNode,
    $isTableRowNode,
    TableCellHeaderStates,
    TableCellNode,
    TableNode,
    TableRowNode,
} from '@lexical/table';
import type { LexicalEditor } from 'lexical';
import { $getEditor, $isParagraphNode, $isTextNode } from 'lexical';

import { $createImageNode, $isImageNode, ImageNode } from '@/components/rich-text-editor/nodes/image-node';

const HR: ElementTransformer = {
    dependencies: [HorizontalRuleNode],
    export: (node) => ($isHorizontalRuleNode(node) ? '***' : null),
    regExp: /^(---|\*\*\*|___)\s?$/,
    replace: (parentNode, _children, _match, isImport) => {
        const line = $createHorizontalRuleNode();

        if (isImport || parentNode.getNextSibling() !== null) {
            parentNode.replace(line);
        } else {
            parentNode.insertBefore(line);
        }

        line.selectNext();
    },
    type: 'element',
};

const IMAGE: TextMatchTransformer = {
    dependencies: [ImageNode],
    export: (node) => ($isImageNode(node) ? `![${node.getAltText()}](${node.getSrc()})` : null),
    importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
    regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
    replace: (textNode, match) => {
        const [, altText = '', src = ''] = match;
        textNode.replace($createImageNode({ src, altText }));
    },
    trigger: ')',
    type: 'text-match',
};

const TABLE_ROW_REG_EXP = /^(?:\|)(.+)(?:\|)\s?$/;
const TABLE_ROW_DIVIDER_REG_EXP = /^(\| ?:?-*:? ?)+\|\s?$/;

function getSupportedTransformers(editor: LexicalEditor, transformers: Transformer[]) {
    return transformers.filter(
        (transformer) =>
            transformer.type === 'text-format' || transformer.dependencies.every((node) => editor.hasNode(node)),
    );
}

function $createTableCell(markdown: string) {
    const cell = $createTableCellNode(TableCellHeaderStates.NO_STATUS);
    $convertFromMarkdownString(
        markdown.replace(/\\n/g, '\n'),
        getSupportedTransformers($getEditor(), EDITOR_TRANSFORMERS),
        cell,
    );

    return cell;
}

function $mapToTableCells(text: string): TableCellNode[] | null {
    const match = text.match(TABLE_ROW_REG_EXP);
    if (!match?.[1]) return null;

    return match[1].split('|').map((cell) => $createTableCell(cell));
}

function getTableColumnCount(table: TableNode) {
    const row = table.getFirstChild();
    return $isTableRowNode(row) ? row.getChildrenSize() : 0;
}

const TABLE: ElementTransformer = {
    dependencies: [TableNode, TableRowNode, TableCellNode],
    export: (node) => {
        if (!$isTableNode(node)) return null;

        const transformers = getSupportedTransformers($getEditor(), EDITOR_TRANSFORMERS);
        const output: string[] = [];

        for (const row of node.getChildren()) {
            if (!$isTableRowNode(row)) continue;

            const cells: string[] = [];
            let isHeaderRow = false;

            for (const cell of row.getChildren()) {
                if (!$isTableCellNode(cell)) continue;

                cells.push($convertToMarkdownString(transformers, cell).replace(/\n/g, '\\n').trim());
                if (cell.hasHeaderState(TableCellHeaderStates.ROW)) isHeaderRow = true;
            }

            output.push(`| ${cells.join(' | ')} |`);
            if (isHeaderRow) output.push(`| ${cells.map(() => '---').join(' | ')} |`);
        }

        return output.join('\n');
    },
    regExp: TABLE_ROW_REG_EXP,
    replace: (parentNode, _children, match) => {
        if (TABLE_ROW_DIVIDER_REG_EXP.test(match[0])) {
            const table = parentNode.getPreviousSibling();
            const lastRow = $isTableNode(table) ? table.getLastChild() : null;
            if (!$isTableRowNode(lastRow)) return;

            for (const cell of lastRow.getChildren()) {
                if ($isTableCellNode(cell)) cell.setHeaderStyles(TableCellHeaderStates.ROW, TableCellHeaderStates.ROW);
            }
            parentNode.remove();
            return;
        }

        const matchCells = $mapToTableCells(match[0]);
        if (matchCells === null) return;

        const rows = [matchCells];
        let maxCells = matchCells.length;
        let sibling = parentNode.getPreviousSibling();

        while ($isParagraphNode(sibling) && sibling.getChildrenSize() === 1) {
            const firstChild = sibling.getFirstChild();
            if (!$isTextNode(firstChild)) break;

            const cells = $mapToTableCells(firstChild.getTextContent());
            if (cells === null) break;

            maxCells = Math.max(maxCells, cells.length);
            rows.unshift(cells);

            const previous = sibling.getPreviousSibling();
            sibling.remove();
            sibling = previous;
        }

        const table = $createTableNode();
        for (const cells of rows) {
            const row = $createTableRowNode();
            table.append(row);

            for (let index = 0; index < maxCells; index++) {
                row.append(cells[index] ?? $createTableCell(''));
            }
        }

        const previous = parentNode.getPreviousSibling();
        if ($isTableNode(previous) && getTableColumnCount(previous) === maxCells) {
            previous.append(...table.getChildren());
            parentNode.remove();
        } else {
            parentNode.replace(table);
        }

        table.selectEnd();
    },
    type: 'element',
};

const EDITOR_TRANSFORMERS: Transformer[] = [
    TABLE,
    HR,
    CHECK_LIST,
    ...ELEMENT_TRANSFORMERS,
    ...MULTILINE_ELEMENT_TRANSFORMERS,
    ...TEXT_FORMAT_TRANSFORMERS,
    IMAGE,
    ...TEXT_MATCH_TRANSFORMERS,
];

export { EDITOR_TRANSFORMERS, getSupportedTransformers, HR, IMAGE, TABLE };
