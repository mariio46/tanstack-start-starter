import { defineExtension } from 'lexical';

import { MentionNode } from '@/components/rich-text-editor/nodes/mention-node';

const MentionExtension = defineExtension({
    name: '@rich-text-editor/mention',
    nodes: () => [MentionNode],
});

export { MentionExtension };
