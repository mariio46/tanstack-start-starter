import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { $insertEmoji, EmojiPicker } from '@/components/rich-text-editor/plugins/emoji-picker';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function InsertEmojiDialog({ close }: { close: () => void }) {
    const [editor] = useLexicalComposerContext();

    return (
        <>
            <DialogHeader>
                <DialogTitle>Sisipkan emoji</DialogTitle>
                <DialogDescription>
                    Cari berdasarkan nama (bahasa Inggris), atau ketik ":" diikuti nama emoji di editor.
                </DialogDescription>
            </DialogHeader>
            <EmojiPicker
                onSelect={(emoji) => {
                    editor.update(() => $insertEmoji(emoji.emoji));
                    close();
                }}
            />
        </>
    );
}

export { InsertEmojiDialog };
