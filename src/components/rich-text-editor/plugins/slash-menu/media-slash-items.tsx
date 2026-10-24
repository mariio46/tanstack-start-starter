import { IconPhoto } from '@tabler/icons-react';

import { useEditorDialog } from '@/components/rich-text-editor/plugins/dialogs/dialog-host';
import { InsertImageDialog } from '@/components/rich-text-editor/plugins/dialogs/insert-image-dialog';

import { useSlashMenuItems } from './editor-slash-menu';

function MediaSlashItems() {
    const dialog = useEditorDialog();

    useSlashMenuItems([
        {
            value: 'image',
            label: 'Gambar',
            icon: IconPhoto,
            description: 'Upload atau sematkan lewat link',
            group: 'Media',
            keywords: ['picture', 'photo', 'img', 'upload', 'foto'],
            onSelect: () => dialog.open((close) => <InsertImageDialog close={close} />),
        },
    ]);

    return null;
}

export { MediaSlashItems };
