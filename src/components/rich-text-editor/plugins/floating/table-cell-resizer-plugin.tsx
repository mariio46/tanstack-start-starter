import * as React from 'react';
import { createPortal } from 'react-dom';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { TableNode } from '@lexical/table';
import {
    $computeTableMapSkipCellCheck,
    $findTableNode,
    $getTableCellNodeRect,
    $isTableCellNode,
    $isTableRowNode,
} from '@lexical/table';
import type { LexicalEditor, NodeKey } from 'lexical';
import { $getNearestNodeFromDOMNode, $getNodeByKey, SKIP_SCROLL_INTO_VIEW_TAG } from 'lexical';

import { cn } from '@/lib/utils';

import { TABLE_MIN_COLUMN_WIDTH, TABLE_MIN_ROW_HEIGHT } from '@/components/rich-text-editor/constants';
import { useEditorAnchor } from '@/components/rich-text-editor/editor-root';
import type { AnchorRect } from '@/components/rich-text-editor/plugins/floating/table-dom';
import {
    getAnchorRect,
    getTableCellFromTarget,
    getVisibleTableRect,
} from '@/components/rich-text-editor/plugins/floating/table-dom';
import { useFormatState } from '@/components/rich-text-editor/plugins/toolbar/editor-toolbar';

type ResizeDirection = 'column' | 'row';

type ResizerHover = { cellKey: NodeKey; column: AnchorRect; row: AnchorRect };

type ResizerDrag = { direction: ResizeDirection; start: number; delta: number };

const HANDLE_SIZE = 8;

function isSameRect(a: AnchorRect, b: AnchorRect) {
    return a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height;
}

function isSameHover(a: ResizerHover | null, b: ResizerHover | null) {
    if (a === null || b === null) return a === b;

    return a.cellKey === b.cellKey && isSameRect(a.column, b.column) && isSameRect(a.row, b.row);
}

function $measureColumnWidths(editor: LexicalEditor, table: TableNode) {
    const [gridMap] = $computeTableMapSkipCellCheck(table, null, null);
    const columnCount = gridMap[0]?.length ?? 0;

    return Array.from({ length: columnCount }, (_, column) => {
        const exact = gridMap.find((row) => row[column]?.startColumn === column && row[column].cell.getColSpan() === 1);
        const { cell } = exact?.[column] ?? gridMap[0][column];
        const width = editor.getElementByKey(cell.getKey())?.getBoundingClientRect().width;

        return Math.round(width ? width / cell.getColSpan() : TABLE_MIN_COLUMN_WIDTH);
    });
}

function $resizeTable(editor: LexicalEditor, cellKey: NodeKey, direction: ResizeDirection, delta: number) {
    const cell = $getNodeByKey(cellKey);
    if (!$isTableCellNode(cell)) return;

    const table = $findTableNode(cell);
    const rect = $getTableCellNodeRect(cell);
    if (!table || !rect) return;

    if (direction === 'column') {
        const current = table.getColWidths();
        const widths = [
            ...(current?.length === table.getColumnCount() ? current : $measureColumnWidths(editor, table)),
        ];
        const column = rect.columnIndex + rect.colSpan - 1;
        widths[column] = Math.max(Math.round(widths[column] + delta), TABLE_MIN_COLUMN_WIDTH);
        table.setColWidths(widths);
        return;
    }

    const row = table.getChildAtIndex(rect.rowIndex + rect.rowSpan - 1);
    if (!$isTableRowNode(row)) return;

    const height = row.getHeight() ?? editor.getElementByKey(row.getKey())?.getBoundingClientRect().height;
    if (height === undefined) return;

    row.setHeight(Math.max(Math.round(height + delta), TABLE_MIN_ROW_HEIGHT));
}

function TableCellResizerPlugin() {
    const [editor] = useLexicalComposerContext();
    const anchor = useEditorAnchor();
    const { isEditable } = useFormatState();
    const [hover, setHover] = React.useState<ResizerHover | null>(null);
    const [drag, setDrag] = React.useState<ResizerDrag | null>(null);
    const draggingRef = React.useRef(false);

    React.useEffect(() => {
        if (!anchor || !isEditable) return;

        const handleMouseMove = (event: MouseEvent) => {
            if (draggingRef.current) return;
            if (event.target instanceof Element && event.target.closest('[data-slot="editor-table-resizer"]')) return;

            const cell = getTableCellFromTarget(editor, event.target);
            const table = cell?.closest('table');
            if (!cell || !table) return setHover(null);

            const cellKey = editor
                .getEditorState()
                .read(() => $getNearestNodeFromDOMNode(cell)?.getKey() ?? null, { editor });
            if (cellKey === null) return setHover(null);

            const cellRect = getAnchorRect(cell, anchor);
            const tableRect = getVisibleTableRect(table, anchor);
            const next: ResizerHover = {
                cellKey,
                column: {
                    top: tableRect.top,
                    left: cellRect.left + cellRect.width - HANDLE_SIZE / 2,
                    width: HANDLE_SIZE,
                    height: tableRect.height,
                },
                row: {
                    top: cellRect.top + cellRect.height - HANDLE_SIZE / 2,
                    left: tableRect.left,
                    width: tableRect.width,
                    height: HANDLE_SIZE,
                },
            };

            setHover((prev) => (isSameHover(prev, next) ? prev : next));
        };
        const handleMouseLeave = () => {
            if (!draggingRef.current) setHover(null);
        };

        anchor.addEventListener('mousemove', handleMouseMove);
        anchor.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            anchor.removeEventListener('mousemove', handleMouseMove);
            anchor.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [editor, anchor, isEditable]);

    if (!anchor || !hover || !isEditable) return null;

    const { cellKey } = hover;

    const endDrag = () => {
        draggingRef.current = false;
        setDrag(null);
        setHover(null);
    };

    const handleProps = (direction: ResizeDirection) => ({
        onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
            if (event.button !== 0) return;

            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            draggingRef.current = true;
            setDrag({ direction, start: direction === 'column' ? event.clientX : event.clientY, delta: 0 });
        },
        onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
            if (!drag) return;

            const position = drag.direction === 'column' ? event.clientX : event.clientY;
            setDrag({ ...drag, delta: position - drag.start });
        },
        onPointerUp: () => {
            if (!drag) return;

            if (drag.delta !== 0) {
                editor.update(() => $resizeTable(editor, cellKey, drag.direction, drag.delta), {
                    tag: SKIP_SCROLL_INTO_VIEW_TAG,
                });
            }
            endDrag();
        },
        onPointerCancel: endDrag,
    });

    const columnOffset = drag?.direction === 'column' ? drag.delta : 0;
    const rowOffset = drag?.direction === 'row' ? drag.delta : 0;

    const handleClassName =
        'absolute z-10 touch-none after:absolute after:bg-primary after:opacity-0 after:transition-opacity hover:after:opacity-100 data-dragging:after:opacity-100';

    return createPortal(
        <>
            <div
                aria-hidden='true'
                data-slot='editor-table-resizer'
                data-direction='column'
                data-dragging={drag?.direction === 'column' || undefined}
                className={cn(
                    handleClassName,
                    'cursor-col-resize after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2',
                )}
                style={{ ...hover.column, left: hover.column.left + columnOffset }}
                {...handleProps('column')}
            />
            <div
                aria-hidden='true'
                data-slot='editor-table-resizer'
                data-direction='row'
                data-dragging={drag?.direction === 'row' || undefined}
                className={cn(
                    handleClassName,
                    'cursor-row-resize after:inset-x-0 after:top-1/2 after:h-0.5 after:-translate-y-1/2',
                )}
                style={{ ...hover.row, top: hover.row.top + rowOffset }}
                {...handleProps('row')}
            />
        </>,
        anchor,
    );
}

export { TableCellResizerPlugin };
