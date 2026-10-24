import { TreeViewPlugin } from '@/components/rich-text-editor/plugins/tree-view-plugin';
import { RichTextEditor } from '@/components/rich-text-editor/rich-text-editor';

import { EXAMPLE_DRAFT_VALUE } from './constants';

const TreeViewRichTextEditor = () => {
    return (
        <RichTextEditor defaultValue={EXAMPLE_DRAFT_VALUE} aria-label='Konten' contentClassName='min-h-40'>
            <TreeViewPlugin />
        </RichTextEditor>
    );
};

export { TreeViewRichTextEditor };
