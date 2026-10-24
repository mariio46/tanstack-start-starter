import * as React from 'react';
import { createPortal } from 'react-dom';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $computeTableMapSkipCellCheck,
    $findTableNode,
    $insertTableColumnAtNode,
    $insertTableRowAtNode,
    $isTableNode,
} from '@lexical/table';
import { IconPlus } from '@tabler/icons-react';
import type { NodeKey } from 'lexical';
import { $getNearestNodeFromDOMNode, $getNodeByKey } from 'lexical';

import { useEditorAnchor } from '@/components/rich-text-editor/editor-root';
import type { AnchorRect } from '@/components/rich-text-editor/plugins/floating/table-dom';
import { getTableCellFromTarget, getVisibleTableRect } from '@/components/rich-text-editor/plugins/floating/table-dom';
import { useFormatState } from '@/components/rich-text-editor/plugins/toolbar/editor-toolbar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type HoverActions = { tableKey: NodeKey; table: AnchorRect; column: AnchorRect; row: AnchorRect };

const BUTTON_SIZE = 16;
const BUTTON_GAP = 4;

function isNearTable({ table, column, row }: HoverActions, x: number, y: number) {
    return x >= table.left && x <= column.left + column.width && y >= table.top && y <= row.top + row.height;
}

function isSameHover(a: HoverActions | null, b: HoverActions | null) {
    if (a === null || b === null) return a === b;

    return (
        a.tableKey === b.tableKey &&
        a.column.top === b.column.top &&
        a.column.left === b.column.left &&
        a.column.height === b.column.height &&
        a.row.top === b.row.top &&
        a.row.left === b.row.left &&
        a.row.width === b.row.width
    );
}

function TableHoverActionsPlugin() {
    const [editor] = useLexicalComposerContext();
    const anchor = useEditorAnchor();
    const { isEditable } = useFormatState();
    const [hover, setHover] = React.useState<HoverActions | null>(null);

    React.useEffect(() => {
        if (!anchor || !isEditable) return;

        const handleMouseMove = (event: MouseEvent) => {
            const cell = getTableCellFromTarget(editor, event.target);
            const table = cell?.closest('table');

            if (!cell || !table) {
                const anchorRect = anchor.getBoundingClientRect();
                const x = event.clientX - anchorRect.left + anchor.scrollLeft;
                const y = event.clientY - anchorRect.top + anchor.scrollTop;

                return setHover((prev) => (prev && isNearTable(prev, x, y) ? prev : null));
            }

            const tableKey = editor.getEditorState().read(
                () => {
                    const node = $getNearestNodeFromDOMNode(cell);
                    return node ? ($findTableNode(node)?.getKey() ?? null) : null;
                },
                { editor },
            );
            if (tableKey === null) return setHover(null);

            const rect = getVisibleTableRect(table, anchor);
            const next: HoverActions = {
                tableKey,
                table: rect,
                column: {
                    top: rect.top,
                    left: rect.left + rect.width + BUTTON_GAP,
                    width: BUTTON_SIZE,
                    height: rect.height,
                },
                row: {
                    top: rect.top + rect.height + BUTTON_GAP,
                    left: rect.left,
                    width: rect.width,
                    height: BUTTON_SIZE,
                },
            };

            setHover((prev) => (isSameHover(prev, next) ? prev : next));
        };
        const handleMouseLeave = () => setHover(null);

        anchor.addEventListener('mousemove', handleMouseMove);
        anchor.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            anchor.removeEventListener('mousemove', handleMouseMove);
            anchor.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [editor, anchor, isEditable]);

    if (!anchor || !hover || !isEditable) return null;

    const add = (direction: 'column' | 'row') => {
        editor.update(() => {
            const table = $getNodeByKey(hover.tableKey);
            if (!$isTableNode(table)) return;

            const [gridMap] = $computeTableMapSkipCellCheck(table, null, null);
            const lastRow = gridMap[gridMap.length - 1];
            if (!lastRow) return;

            if (direction === 'row') {
                $insertTableRowAtNode(lastRow[0].cell, true);
            } else {
                $insertTableColumnAtNode(gridMap[0][gridMap[0].length - 1].cell, true);
            }
        });
        setHover(null);
    };

    const buttons = [
        { direction: 'column' as const, label: 'Tambah kolom', rect: hover.column },
        { direction: 'row' as const, label: 'Tambah baris', rect: hover.row },
    ];

    return createPortal(
        buttons.map(({ direction, label, rect }) => (
            <Tooltip key={direction}>
                <TooltipTrigger
                    render={
                        <button
                            type='button'
                            aria-label={label}
                            data-slot='editor-table-add'
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => add(direction)}
                            className='absolute z-10 flex items-center justify-center rounded-sm bg-muted text-muted-foreground outline-none transition-colors hover:bg-primary/15 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50'
                            style={rect}
                        />
                    }
                >
                    <IconPlus className='size-3' />
                </TooltipTrigger>
                <TooltipContent side={direction === 'column' ? 'right' : 'bottom'}>{label}</TooltipContent>
            </Tooltip>
        )),
        anchor,
    );
}

export { TableHoverActionsPlugin };
