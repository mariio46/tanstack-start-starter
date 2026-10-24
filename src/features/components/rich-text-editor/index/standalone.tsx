import { RichTextEditor } from '@/components/rich-text-editor/rich-text-editor';

import { EXAMPLE_VALUE, searchMentions } from './constants';

const StandaloneRichTextEditor = () => {
    return (
        <RichTextEditor
            aria-label='Dokumen'
            className='h-[28rem]'
            defaultValue={EXAMPLE_VALUE}
            mentions={{ search: searchMentions }}
        />
    );
};

export { StandaloneRichTextEditor };
