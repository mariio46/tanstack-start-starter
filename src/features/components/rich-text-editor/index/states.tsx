import { RichTextEditor } from '@/components/rich-text-editor/rich-text-editor';

import { EXAMPLE_DRAFT_VALUE } from './constants';

const StatesRichTextEditor = () => {
    return (
        <div className='grid gap-6 lg:grid-cols-3'>
            <div className='grid min-w-0 content-start gap-2'>
                <span className='font-medium text-sm/4'>Hanya baca</span>
                <RichTextEditor readOnly defaultValue={EXAMPLE_DRAFT_VALUE} aria-label='Konten hanya baca' />
                <p className='text-muted-foreground text-sm'>
                    Teks tetap bisa dipilih; toolbar dan tombol kunci nonaktif.
                </p>
            </div>
            <div className='grid min-w-0 content-start gap-2'>
                <span className='font-medium text-sm/4'>Nonaktif</span>
                <RichTextEditor disabled defaultValue={EXAMPLE_DRAFT_VALUE} aria-label='Konten nonaktif' />
                <p className='text-muted-foreground text-sm'>
                    Diredupkan, dan tidak ikut terkirim di FormData walaupun punya name.
                </p>
            </div>
            <div className='grid min-w-0 content-start gap-2'>
                <span className='font-medium text-sm/4'>Tidak valid</span>
                <RichTextEditor invalid aria-label='Konten tidak valid' />
                <p className='text-muted-foreground text-sm'>Hanya ring error. Pesannya milik field di sekitarnya.</p>
            </div>
        </div>
    );
};

export { StatesRichTextEditor };
