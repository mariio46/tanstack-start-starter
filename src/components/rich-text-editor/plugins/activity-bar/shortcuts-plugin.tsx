import { formatKeyboardShortcut } from '@lexical/extension';
import { IconKeyboard } from '@tabler/icons-react';

import type { EditorShortcut } from '@/components/rich-text-editor/constants';
import { SHORTCUTS } from '@/components/rich-text-editor/constants';
import { useEditorDialog } from '@/components/rich-text-editor/plugins/dialogs/dialog-host';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

import { EditorActivityBarButton } from './editor-activity-bar';

const LABEL = 'Pintasan keyboard';

const SHORTCUT_GROUPS = SHORTCUTS.reduce<Map<string, EditorShortcut[]>>((groups, shortcut) => {
    groups.set(shortcut.group, [...(groups.get(shortcut.group) ?? []), shortcut]);
    return groups;
}, new Map());

function ShortcutsDialog() {
    return (
        <>
            <DialogHeader>
                <DialogTitle>{LABEL}</DialogTitle>
                <DialogDescription>Pintasan berlaku selama kursor berada di dalam editor.</DialogDescription>
            </DialogHeader>
            <div className='-mx-4 -mb-4 flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-4 pb-4'>
                {[...SHORTCUT_GROUPS].map(([group, shortcuts]) => (
                    <section key={group} className='flex flex-col gap-1'>
                        <h3 className='font-medium text-muted-foreground text-xs'>{group}</h3>
                        <Table>
                            <TableBody>
                                {shortcuts.map((shortcut) => (
                                    <TableRow key={shortcut.id}>
                                        <TableCell className='ps-0'>{shortcut.label}</TableCell>
                                        <TableCell className='pe-0 text-end'>
                                            <KbdGroup>
                                                {formatKeyboardShortcut(shortcut).map((key) => (
                                                    <Kbd key={key}>{key}</Kbd>
                                                ))}
                                            </KbdGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>
                ))}
            </div>
        </>
    );
}

function ShortcutsPlugin() {
    const dialog = useEditorDialog();

    return (
        <EditorActivityBarButton label={LABEL} onClick={() => dialog.open(() => <ShortcutsDialog />)}>
            <IconKeyboard />
        </EditorActivityBarButton>
    );
}

export { ShortcutsPlugin };
