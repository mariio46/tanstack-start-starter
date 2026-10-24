import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';

import { cn } from '@/lib/utils';

import { useEditorConfig } from '@/components/rich-text-editor/editor-root';

const wordSegmenter =
    typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'word' }) : null;

function countWords(text: string) {
    if (!wordSegmenter) return text.split(/\s+/).filter(Boolean).length;

    let count = 0;
    for (const segment of wordSegmenter.segment(text)) {
        if (segment.isWordLike) count += 1;
    }

    return count;
}

function formatCount(count: number, unit: string) {
    return `${count.toLocaleString('id-ID')} ${unit}`;
}

function CountPlugin({ className, ...props }: React.ComponentProps<'div'>) {
    const [editor] = useLexicalComposerContext();
    const { maxLength } = useEditorConfig();
    const [text, setText] = React.useState(() => editor.getEditorState().read(() => $getRoot().getTextContent()));

    React.useEffect(() => editor.registerTextContentListener(setText), [editor]);

    const characters = text.length;
    const isOverLimit = maxLength !== undefined && characters > maxLength;

    return (
        <div className={cn('flex items-center gap-1.5 whitespace-nowrap tabular-nums', className)} {...props}>
            <span>{formatCount(countWords(text), 'kata')}</span>
            <span aria-hidden>·</span>
            <span data-over-limit={isOverLimit || undefined} className='data-over-limit:text-destructive'>
                {maxLength === undefined
                    ? formatCount(characters, 'karakter')
                    : `${characters.toLocaleString('id-ID')} / ${formatCount(maxLength, 'karakter')}`}
            </span>
        </div>
    );
}

export { CountPlugin };
