import { NodeSelectionExtension } from '@lexical/extension';
import { $wrapNodeInElement } from '@lexical/utils';
import {
    $createParagraphNode,
    $insertNodes,
    $isRootOrShadowRoot,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    defineExtension,
} from 'lexical';

import type { ImagePayload } from '@/components/rich-text-editor/nodes/image-node';
import { $createImageNode, ImageNode } from '@/components/rich-text-editor/nodes/image-node';

const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>('INSERT_IMAGE_COMMAND');

function $insertImage(payload: ImagePayload) {
    const image = $createImageNode(payload);
    $insertNodes([image]);

    if ($isRootOrShadowRoot(image.getParentOrThrow())) {
        $wrapNodeInElement(image, $createParagraphNode).selectEnd();
    }
}

const ImageExtension = defineExtension({
    name: '@rich-text-editor/image',
    dependencies: [NodeSelectionExtension],
    nodes: () => [ImageNode],
    register: (editor) =>
        editor.registerCommand(
            INSERT_IMAGE_COMMAND,
            (payload) => {
                $insertImage(payload);
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        ),
});

export { $insertImage, ImageExtension, INSERT_IMAGE_COMMAND };
