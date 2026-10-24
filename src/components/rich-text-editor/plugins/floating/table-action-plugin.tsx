import * as React from 'react';
import { createPortal } from 'react-dom';

import { autoUpdate, computePosition, offset } from '@floating-ui/dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { TableCellNode } from '@lexical/table';
import {
    $deleteTableColumnAtSelection,
    $deleteTableRowAtSelection,
    $findCellNode,
    $findTableNode,
    $getTableCellNodeRect,
    $insertTableColumnAtSelection,
    $insertTableRowAtSelection,
    $isTableCellNode,
    $isTableSelection,
    $mergeCells,
    $setTableColumnIsHeader,
    $setTableRowIsHeader,
    $unmergeCellNode,
    TableCellHeaderStates,
} from '@lexical/table';
import { mergeRegister } from '@lexical/utils';
import {
    IconArrowsJoin,
    IconArrowsSplit,
    IconBucketDroplet,
    IconChevronDown,
    IconColumnInsertLeft,
    IconColumnInsertRight,
    IconColumnRemove,
    IconRowInsertBottom,
    IconRowInsertTop,
    IconRowRemove,
    IconTableOff,
} from '@tabler/icons-react';
import type { NodeKey } from 'lexical';
import {
    $getNodeByKey,
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_LOW,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';

import { COLOR_SWATCHES } from '@/components/rich-text-editor/constants';
import { useEditorAnchor } from '@/components/rich-text-editor/editor-root';
import { useFormatState } from '@/components/rich-text-editor/plugins/toolbar/editor-toolbar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type TableAction = {
    cellKey: NodeKey;
    canMerge: boolean;
    canUnmerge: boolean;
    isHeaderRow: boolean;
    isHeaderColumn: boolean;
    backgroundColor: string;
};

function isSameAction(a: TableAction | null, b: TableAction | null) {
    if (a === null || b === null) return a === b;

    return (Object.keys(a) as (keyof TableAction)[]).every((key) => a[key] === b[key]);
}

function $readTableAction(): TableAction | null {
    const selection = $getSelection();

    let cell: TableCellNode | null = null;
    let canMerge = false;

    if ($isTableSelection(selection)) {
        cell = $findCellNode(selection.focus.getNode());
        canMerge = selection.getNodes().filter($isTableCellNode).length > 1;
    } else if ($isRangeSelection(selection)) {
        cell = $findCellNode(selection.anchor.getNode());
    }

    if (!cell) return null;

    return {
        cellKey: cell.getKey(),
        canMerge,
        canUnmerge: cell.getColSpan() > 1 || cell.getRowSpan() > 1,
        isHeaderRow: cell.hasHeaderState(TableCellHeaderStates.ROW),
        isHeaderColumn: cell.hasHeaderState(TableCellHeaderStates.COLUMN),
        backgroundColor: cell.getBackgroundColor() ?? '',
    };
}

function $ensureCellSelection(cell: TableCellNode) {
    const selection = $getSelection();
    const table = $findTableNode(cell);

    if (
        ($isRangeSelection(selection) || $isTableSelection(selection)) &&
        table !== null &&
        table.is($findTableNode(selection.anchor.getNode()))
    ) {
        return selection;
    }

    cell.selectStart();
    return $getSelection();
}

function TableActionPlugin() {
    const [editor] = useLexicalComposerContext();
    const anchor = useEditorAnchor();
    const { isEditable } = useFormatState();
    const [action, setAction] = React.useState<TableAction | null>(null);
    const [focused, setFocused] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [menuAction, setMenuAction] = React.useState<TableAction | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    const sync = React.useEffectEvent(() => {
        const next = editor.getEditorState().read($readTableAction, { editor });
        setAction((prev) => (isSameAction(prev, next) ? prev : next));
    });

    React.useEffect(
        () =>
            mergeRegister(
                editor.registerUpdateListener(() => sync()),
                editor.registerCommand(
                    SELECTION_CHANGE_COMMAND,
                    () => {
                        sync();
                        return false;
                    },
                    COMMAND_PRIORITY_LOW,
                ),
            ),
        [editor],
    );

    React.useEffect(() => {
        if (!anchor) return;

        const handleFocusIn = () => setFocused(true);
        const handleFocusOut = (event: FocusEvent) => setFocused(anchor.contains(event.relatedTarget as Node | null));

        anchor.addEventListener('focusin', handleFocusIn);
        anchor.addEventListener('focusout', handleFocusOut);

        return () => {
            anchor.removeEventListener('focusin', handleFocusIn);
            anchor.removeEventListener('focusout', handleFocusOut);
        };
    }, [anchor]);

    const current = action ?? menuAction;
    const visible = current !== null && isEditable && (focused || menuAction !== null);
    const cellKey = visible ? current.cellKey : null;

    React.useLayoutEffect(() => {
        const button = buttonRef.current;
        const reference = cellKey === null ? null : editor.getElementByKey(cellKey);
        if (!button || !reference) return;

        return autoUpdate(reference, button, () => {
            computePosition(reference, button, {
                placement: 'top-end',
                middleware: [offset(({ rects }) => ({ mainAxis: -rects.floating.height - 4, alignmentAxis: 4 }))],
            }).then(({ x, y }) => {
                button.style.left = `${x}px`;
                button.style.top = `${y}px`;
            });
        });
    }, [editor, cellKey]);

    if (!anchor || !visible) return null;

    const { canMerge, canUnmerge, isHeaderRow, isHeaderColumn, backgroundColor } = current;

    const handleOpenChange = (open: boolean) => {
        if (open) setMenuAction(current);
        setMenuOpen(open);
    };

    const updateCell = (fn: (cell: TableCellNode) => void) => {
        editor.update(() => {
            const cell = $getNodeByKey(current.cellKey);
            if ($isTableCellNode(cell)) fn(cell);
        });
    };

    const insertRow = (after: boolean) =>
        updateCell((cell) => {
            $ensureCellSelection(cell);
            $insertTableRowAtSelection(after);
        });

    const insertColumn = (after: boolean) =>
        updateCell((cell) => {
            $ensureCellSelection(cell);
            $insertTableColumnAtSelection(after);
        });

    const deleteRow = () =>
        updateCell((cell) => {
            $ensureCellSelection(cell);
            $deleteTableRowAtSelection();
        });

    const deleteColumn = () =>
        updateCell((cell) => {
            $ensureCellSelection(cell);
            $deleteTableColumnAtSelection();
        });

    const deleteTable = () =>
        updateCell((cell) => {
            const table = $findTableNode(cell);
            if (!table) return;

            table.selectPrevious();
            table.remove();
        });

    const mergeCells = () =>
        updateCell(() => {
            const selection = $getSelection();
            if (!$isTableSelection(selection)) return;

            $mergeCells(selection.getNodes().filter($isTableCellNode))?.selectEnd();
        });

    const unmergeCells = () => updateCell((cell) => $unmergeCellNode(cell));

    const toggleHeaderRow = () =>
        updateCell((cell) => {
            const table = $findTableNode(cell);
            const rect = $getTableCellNodeRect(cell);
            if (table && rect) $setTableRowIsHeader(table, rect.rowIndex, !isHeaderRow);
        });

    const toggleHeaderColumn = () =>
        updateCell((cell) => {
            const table = $findTableNode(cell);
            const rect = $getTableCellNodeRect(cell);
            if (table && rect) $setTableColumnIsHeader(table, rect.columnIndex, !isHeaderColumn);
        });

    const setBackground = (color: string | null) =>
        updateCell((cell) => {
            const selection = $getSelection();
            const cells = $isTableSelection(selection) ? selection.getNodes().filter($isTableCellNode) : [cell];

            for (const target of cells) target.setBackgroundColor(color);
        });

    const finalFocus = () => {
        editor.focus();
        return false;
    };

    return createPortal(
        <DropdownMenu
            open={menuOpen}
            onOpenChange={handleOpenChange}
            onOpenChangeComplete={(open) => !open && setMenuAction(null)}
        >
            <DropdownMenuTrigger
                render={
                    <Button
                        ref={buttonRef}
                        variant='outline'
                        size='icon-xs'
                        aria-label='Aksi tabel'
                        data-slot='editor-table-actions'
                        onMouseDown={(event) => event.preventDefault()}
                        className='absolute top-0 left-0 z-10 bg-background shadow-xs'
                    />
                }
            >
                <IconChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' finalFocus={finalFocus} className='w-auto min-w-48'>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => insertRow(false)}>
                        <IconRowInsertTop />
                        Sisipkan baris di atas
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertRow(true)}>
                        <IconRowInsertBottom />
                        Sisipkan baris di bawah
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertColumn(false)}>
                        <IconColumnInsertLeft />
                        Sisipkan kolom di kiri
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => insertColumn(true)}>
                        <IconColumnInsertRight />
                        Sisipkan kolom di kanan
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem disabled={!canMerge} onClick={mergeCells}>
                        <IconArrowsJoin />
                        Gabungkan sel
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={!canUnmerge} onClick={unmergeCells}>
                        <IconArrowsSplit />
                        Pisahkan sel
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuCheckboxItem checked={isHeaderRow} onCheckedChange={toggleHeaderRow}>
                        Baris header
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={isHeaderColumn} onCheckedChange={toggleHeaderColumn}>
                        Kolom header
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <IconBucketDroplet />
                            Latar sel
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent finalFocus={finalFocus} className='max-h-72'>
                            <DropdownMenuCheckboxItem
                                closeOnClick
                                checked={backgroundColor === ''}
                                onCheckedChange={() => setBackground(null)}
                            >
                                <span
                                    aria-hidden='true'
                                    className='size-4 rounded-sm ring-1 ring-foreground/15 ring-inset'
                                />
                                Tanpa warna
                            </DropdownMenuCheckboxItem>
                            {COLOR_SWATCHES.map((swatch) => (
                                <DropdownMenuCheckboxItem
                                    key={swatch.value}
                                    closeOnClick
                                    checked={backgroundColor === swatch.value}
                                    onCheckedChange={() => setBackground(swatch.value)}
                                >
                                    <span
                                        aria-hidden='true'
                                        className='size-4 rounded-sm ring-1 ring-foreground/15 ring-inset'
                                        style={{ backgroundColor: swatch.value }}
                                    />
                                    {swatch.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem variant='destructive' onClick={deleteRow}>
                        <IconRowRemove />
                        Hapus baris
                    </DropdownMenuItem>
                    <DropdownMenuItem variant='destructive' onClick={deleteColumn}>
                        <IconColumnRemove />
                        Hapus kolom
                    </DropdownMenuItem>
                    <DropdownMenuItem variant='destructive' onClick={deleteTable}>
                        <IconTableOff />
                        Hapus tabel
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>,
        anchor,
    );
}

export { TableActionPlugin };
