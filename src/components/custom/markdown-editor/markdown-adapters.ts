import type { Editor } from '@tiptap/core';
import { getEmbedUrlFromYoutubeUrl, isValidYoutubeUrl } from '@tiptap/extension-youtube';

function normalizeMarkdownValue(value?: string | null) {
    return (value ?? '').replaceAll('\r\n', '\n');
}

function serializeEditorMarkdown(value?: string | null) {
    const normalizedValue = normalizeMarkdownValue(value);

    return normalizedValue.replaceAll(/:::youtube\s+\{([^}]+)\}\s*:::/g, (_, attributes) => {
        const src = attributes.match(/src="([^"]+)"/)?.[1] ?? '';
        const width = attributes.match(/width="([^"]+)"/)?.[1] ?? '960';
        const height = attributes.match(/height="([^"]+)"/)?.[1] ?? '540';
        const start = Number(attributes.match(/start="([^"]+)"/)?.[1] ?? '0');

        if (!src || !isValidYoutubeUrl(src)) {
            return '';
        }

        const embedUrl = getEmbedUrlFromYoutubeUrl({
            url: src,
            controls: true,
            nocookie: true,
            startAt: start,
        });

        return `<div data-youtube-video><iframe src="${embedUrl}" width="${width}" height="${height}" allowfullscreen></iframe></div>`;
    });
}

function isValidHttpUrl(value: string) {
    try {
        const url = new URL(value);

        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function isValidImageUrl(value: string) {
    if (!isValidHttpUrl(value)) {
        return false;
    }

    const pathname = new URL(value).pathname.toLowerCase();

    return /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(pathname) || pathname.length > 1;
}

function getCurrentLinkUrl(editor: Editor | null) {
    return editor?.getAttributes('link').href ?? '';
}

export {
    getCurrentLinkUrl,
    isValidHttpUrl,
    isValidImageUrl,
    isValidYoutubeUrl,
    normalizeMarkdownValue,
    serializeEditorMarkdown,
};
