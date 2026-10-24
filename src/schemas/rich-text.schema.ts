import * as z from 'zod';

import { getRichTextLength, isRichTextEmpty } from '@/lib/rich-text';

type RichTextConstraints = {
    required?: boolean;
    maxLength?: number;
};

function richTextSchema({ required = false, maxLength }: RichTextConstraints = {}) {
    return z.string().superRefine((value, ctx) => {
        if (isRichTextEmpty(value)) {
            if (required) ctx.addIssue({ code: 'custom', message: 'Konten wajib diisi.' });

            return;
        }

        if (maxLength !== undefined && getRichTextLength(value) > maxLength) {
            ctx.addIssue({ code: 'custom', message: `Konten maksimal ${maxLength} karakter.` });
        }
    });
}

const defaultRichTextPayload = '';

export type { RichTextConstraints };
export { defaultRichTextPayload, richTextSchema };
