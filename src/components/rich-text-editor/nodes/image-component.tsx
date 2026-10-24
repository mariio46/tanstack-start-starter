import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { IconPhotoOff } from '@tabler/icons-react';
import type { NodeKey } from 'lexical';
import { $getNodeByKey, CLICK_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';

import { cn } from '@/lib/utils';

import { IMAGE_MIN_WIDTH } from '@/components/rich-text-editor/constants';

import { $isImageNode } from './image-node';

const RESIZE_HANDLES = [
    { position: 'top-left', direction: -1, className: '-top-1.5 -left-1.5 cursor-nwse-resize' },
    { position: 'top-right', direction: 1, className: '-top-1.5 -right-1.5 cursor-nesw-resize' },
    { position: 'bottom-left', direction: -1, className: '-bottom-1.5 -left-1.5 cursor-nesw-resize' },
    { position: 'bottom-right', direction: 1, className: '-right-1.5 -bottom-1.5 cursor-nwse-resize' },
] as const;

type ResizeState = {
    startX: number;
    startWidth: number;
    maxWidth: number;
    direction: number;
    width: number;
};

function getContentWidth(element: HTMLElement | null) {
    if (!element) return Number.POSITIVE_INFINITY;

    const style = getComputedStyle(element);

    return element.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
}

interface ImageComponentProps {
    nodeKey: NodeKey;
    src: string;
    altText: string;
    width: number | null;
    maxWidth: number;
}

function ImageComponent({ nodeKey, src, altText, width, maxWidth }: ImageComponentProps) {
    const [editor] = useLexicalComposerContext();
    const isEditable = useLexicalEditable();
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
    const [isResizing, setIsResizing] = React.useState(false);

    const wrapperRef = React.useRef<HTMLSpanElement>(null);
    const imageRef = React.useRef<HTMLImageElement>(null);
    const resizeRef = React.useRef<ResizeState | null>(null);

    const isFailed = failedSrc === src;
    const isActive = isEditable && (isSelected || isResizing);

    React.useEffect(() => {
        return editor.registerCommand(
            CLICK_COMMAND,
            (event) => {
                const target = event.target as Node | null;
                if (!editor.isEditable() || !wrapperRef.current?.contains(target)) return false;

                if ((target as HTMLElement).closest('[data-slot="image-resize-handle"]')) return true;

                if (event.shiftKey) {
                    setSelected(!isSelected);
                } else {
                    clearSelection();
                    setSelected(true);
                }

                return true;
            },
            COMMAND_PRIORITY_LOW,
        );
    }, [editor, isSelected, setSelected, clearSelection]);

    const handlePointerDown = (event: React.PointerEvent<HTMLSpanElement>, direction: number) => {
        const image = imageRef.current;
        if (!image || event.button !== 0) return;

        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);

        const startWidth = image.getBoundingClientRect().width;
        const block = editor.getElementByKey(nodeKey)?.parentElement ?? null;

        resizeRef.current = {
            startX: event.clientX,
            startWidth,
            maxWidth: Math.max(Math.min(maxWidth, getContentWidth(block)), IMAGE_MIN_WIDTH),
            direction,
            width: startWidth,
        };
        setIsResizing(true);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
        const resize = resizeRef.current;
        const image = imageRef.current;
        if (!resize || !image) return;

        const next = resize.startWidth + (event.clientX - resize.startX) * resize.direction;
        resize.width = Math.min(Math.max(next, IMAGE_MIN_WIDTH), resize.maxWidth);
        image.style.width = `${resize.width}px`;
    };

    const endResize = (commit: boolean) => {
        const resize = resizeRef.current;
        const image = imageRef.current;
        resizeRef.current = null;
        setIsResizing(false);
        if (!resize || !image) return;

        if (!commit || Math.round(resize.width) === Math.round(resize.startWidth)) {
            image.style.width = width === null ? '' : `${width}px`;
            return;
        }

        const nextWidth = Math.round(resize.width);
        const ratio = image.naturalWidth > 0 ? image.naturalHeight / image.naturalWidth : null;
        const nextHeight = ratio === null ? null : Math.round(nextWidth * ratio);

        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isImageNode(node)) node.setWidthAndHeight(nextWidth, nextHeight);
        });
    };

    return (
        <span
            ref={wrapperRef}
            data-slot='image'
            data-selected={isActive || undefined}
            className='relative inline-block max-w-full align-bottom'
        >
            {isFailed ? (
                <span className='inline-flex items-center gap-2 rounded-md border border-dashed bg-muted px-3 py-2 text-muted-foreground text-sm'>
                    <IconPhotoOff className='size-4 shrink-0' />
                    {altText || 'Gambar gagal dimuat'}
                </span>
            ) : (
                <img
                    ref={imageRef}
                    src={src}
                    alt={altText}
                    draggable={false}
                    onError={() => setFailedSrc(src)}
                    style={{ width: width ?? undefined, maxWidth: `min(${maxWidth}px, 100%)` }}
                    className={cn(
                        'block h-auto rounded-md',
                        isActive && 'ring-2 ring-ring ring-offset-2 ring-offset-background',
                        isEditable && 'cursor-default',
                    )}
                />
            )}
            {isActive &&
                !isFailed &&
                RESIZE_HANDLES.map((handle) => (
                    <span
                        key={handle.position}
                        data-slot='image-resize-handle'
                        aria-hidden
                        className={cn(
                            'absolute z-10 size-3 touch-none rounded-full border-2 border-background bg-primary',
                            handle.className,
                        )}
                        onPointerDown={(event) => handlePointerDown(event, handle.direction)}
                        onPointerMove={handlePointerMove}
                        onPointerUp={() => endResize(true)}
                        onPointerCancel={() => endResize(false)}
                    />
                ))}
        </span>
    );
}

export { ImageComponent };
