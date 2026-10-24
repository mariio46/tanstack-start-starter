import type * as React from 'react';

import { ContentEditable } from '@lexical/react/LexicalContentEditable';

import { cn } from '@/lib/utils';

import { useEditorAnchorContext, useEditorConfig } from '@/components/rich-text-editor/editor-root';

type EditorContentVariant = 'default' | 'toolbar' | 'draggable';

const VARIANT_PADDING: Record<EditorContentVariant, string> = {
    default: 'px-4 py-3',
    toolbar: 'px-6 py-4',
    draggable: 'py-4 ps-14 pe-6',
};

interface EditorContentProps
    extends Omit<
        React.ComponentProps<'div'>,
        'children' | 'placeholder' | 'aria-placeholder' | 'ref' | 'contentEditable'
    > {
    variant?: EditorContentVariant;
    placeholder?: string;
    placeholderClassName?: string;
}

function EditorContent({
    variant = 'default',
    placeholder,
    className,
    placeholderClassName,
    ...props
}: EditorContentProps) {
    const { invalid } = useEditorConfig();
    const { setAnchor } = useEditorAnchorContext();

    const contentProps = {
        ...props,
        'data-variant': variant,
        'aria-invalid': invalid || undefined,
        className: cn('min-h-32 flex-1 break-words text-foreground outline-none', VARIANT_PADDING[variant], className),
    };

    return (
        <div
            ref={setAnchor}
            data-slot='editor-content'
            className='relative flex min-h-0 flex-1 flex-col overflow-y-auto'
        >
            {placeholder ? (
                <ContentEditable
                    {...contentProps}
                    aria-placeholder={placeholder}
                    placeholder={
                        <div
                            aria-hidden
                            data-slot='editor-placeholder'
                            className={cn(
                                'pointer-events-none absolute inset-x-0 top-0 select-none truncate text-muted-foreground leading-7',
                                VARIANT_PADDING[variant],
                                placeholderClassName,
                            )}
                        >
                            {placeholder}
                        </div>
                    }
                />
            ) : (
                <ContentEditable {...contentProps} />
            )}
        </div>
    );
}

export type { EditorContentProps, EditorContentVariant };
export { EditorContent };
