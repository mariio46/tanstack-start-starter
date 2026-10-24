import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DRAG_DROP_PASTE } from '@lexical/rich-text';
import { COMMAND_PRIORITY_LOW } from 'lexical';

import { isImageFile, readFileAsDataUrl, validateFiles } from '@/lib/file';

import { IMAGE_ACCEPT, IMAGE_MAX_SIZE } from '@/components/rich-text-editor/constants';
import { useEditorConfig } from '@/components/rich-text-editor/editor-root';
import { INSERT_IMAGE_COMMAND } from '@/components/rich-text-editor/extensions/image';

function validateImageFile(file: File) {
    return validateFiles([file], { accept: IMAGE_ACCEPT, maxSize: IMAGE_MAX_SIZE });
}

function resolveImageSrc(file: File, uploadImage?: (file: File) => Promise<string>) {
    return uploadImage ? uploadImage(file) : readFileAsDataUrl(file);
}

function getImageAltText(file: File) {
    return file.name.replace(/\.[^.]+$/, '');
}

function ImagePlugin() {
    const [editor] = useLexicalComposerContext();
    const { uploadImage } = useEditorConfig();

    const insertFiles = React.useEffectEvent(async (files: File[]) => {
        for (const file of files) {
            if (validateImageFile(file) !== null) continue;

            try {
                const src = await resolveImageSrc(file, uploadImage);
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText: getImageAltText(file) });
            } catch {}
        }
    });

    React.useEffect(() => {
        return editor.registerCommand(
            DRAG_DROP_PASTE,
            (files) => {
                const images = files.filter(isImageFile);
                if (images.length === 0 || !editor.isEditable()) return false;

                void insertFiles(images);
                return true;
            },
            COMMAND_PRIORITY_LOW,
        );
    }, [editor]);

    return null;
}

export { getImageAltText, ImagePlugin, resolveImageSrc, validateImageFile };
