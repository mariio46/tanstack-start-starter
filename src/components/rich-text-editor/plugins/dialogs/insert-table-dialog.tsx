import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_TABLE_COMMAND } from '@lexical/table';

import {
    TABLE_DEFAULT_COLUMNS,
    TABLE_DEFAULT_ROWS,
    TABLE_MAX_COLUMNS,
    TABLE_MAX_ROWS,
} from '@/components/rich-text-editor/constants';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function parseCount(value: string, max: number) {
    const count = Number.parseInt(value, 10);
    if (Number.isNaN(count)) return null;

    return Math.min(Math.max(count, 1), max);
}

function InsertTableDialog({ close }: { close: () => void }) {
    const [editor] = useLexicalComposerContext();
    const id = React.useId();
    const [rows, setRows] = React.useState(String(TABLE_DEFAULT_ROWS));
    const [columns, setColumns] = React.useState(String(TABLE_DEFAULT_COLUMNS));
    const [headerRow, setHeaderRow] = React.useState(true);

    const rowCount = parseCount(rows, TABLE_MAX_ROWS);
    const columnCount = parseCount(columns, TABLE_MAX_COLUMNS);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (rowCount === null || columnCount === null) return;

        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows: String(rowCount),
            columns: String(columnCount),
            includeHeaders: { rows: headerRow, columns: false },
        });
        close();
    };

    return (
        <form onSubmit={handleSubmit} className='grid gap-4'>
            <DialogHeader>
                <DialogTitle>Sisipkan tabel</DialogTitle>
                <DialogDescription>
                    Maksimal {TABLE_MAX_ROWS} baris dan {TABLE_MAX_COLUMNS} kolom.
                </DialogDescription>
            </DialogHeader>
            <div className='grid grid-cols-2 gap-3'>
                <div className='grid gap-1.5'>
                    <Label htmlFor={`${id}-rows`}>Baris</Label>
                    <Input
                        id={`${id}-rows`}
                        type='number'
                        inputMode='numeric'
                        min={1}
                        max={TABLE_MAX_ROWS}
                        value={rows}
                        aria-invalid={rowCount === null}
                        onChange={(event) => setRows(event.currentTarget.value)}
                        onBlur={() => rowCount !== null && setRows(String(rowCount))}
                    />
                </div>
                <div className='grid gap-1.5'>
                    <Label htmlFor={`${id}-columns`}>Kolom</Label>
                    <Input
                        id={`${id}-columns`}
                        type='number'
                        inputMode='numeric'
                        min={1}
                        max={TABLE_MAX_COLUMNS}
                        value={columns}
                        aria-invalid={columnCount === null}
                        onChange={(event) => setColumns(event.currentTarget.value)}
                        onBlur={() => columnCount !== null && setColumns(String(columnCount))}
                    />
                </div>
            </div>
            <Label className='w-fit font-normal'>
                <Checkbox checked={headerRow} onCheckedChange={setHeaderRow} />
                Baris header
            </Label>
            <DialogFooter>
                <DialogClose render={<Button type='button' variant='outline' />}>Batal</DialogClose>
                <Button type='submit' disabled={rowCount === null || columnCount === null}>
                    Sisipkan
                </Button>
            </DialogFooter>
        </form>
    );
}

export { InsertTableDialog };
