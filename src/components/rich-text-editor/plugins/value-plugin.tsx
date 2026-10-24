import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { LexicalEditor } from 'lexical';
import { $createParagraphNode, $getRoot, $getSelection, CLEAR_HISTORY_COMMAND, HISTORY_MERGE_TAG } from 'lexical';

import { useControllableState } from '@/hooks/use-controllable-state';

import { useEditorConfig } from '@/components/rich-text-editor/editor-root';
import { serializeEditorState } from '@/components/rich-text-editor/serialize';

const VALUE_SYNC_TAG = 'rich-text-editor-value-sync';

function applyValue(editor: LexicalEditor, value: string) {
    if (value === '') {
        editor.update(
            () => {
                const root = $getRoot();
                const paragraph = $createParagraphNode();
                const selection = $getSelection();

                root.clear().append(paragraph);

                if (selection !== null) paragraph.select();
            },
            { tag: [VALUE_SYNC_TAG, HISTORY_MERGE_TAG] },
        );
    } else {
        try {
            editor.setEditorState(editor.parseEditorState(value), { tag: VALUE_SYNC_TAG });
        } catch {
            return;
        }
    }

    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
}

interface ValuePluginProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    name?: string;
}

function ValuePlugin({ value, defaultValue, onValueChange, name }: ValuePluginProps) {
    const [editor] = useLexicalComposerContext();
    const { disabled } = useEditorConfig();

    const inputRef = React.useRef<HTMLInputElement>(null);

    const lastEmittedRef = React.useRef('');

    const [state, setState] = useControllableState<string>({
        value,
        defaultValue: defaultValue ?? '',
        onChange: onValueChange,
    });

    const emit = React.useEffectEvent((next: string) => setState(next));
    const reset = React.useEffectEvent(() => setState(defaultValue ?? ''));

    React.useEffect(
        () =>
            editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves, tags }) => {
                if (tags.has(VALUE_SYNC_TAG)) return;
                if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

                const next = serializeEditorState(editorState);

                if (next === lastEmittedRef.current) return;

                lastEmittedRef.current = next;
                emit(next);
            }),
        [editor],
    );

    React.useEffect(() => {
        if (state === lastEmittedRef.current) return;

        lastEmittedRef.current = state;
        applyValue(editor, state);
    }, [editor, state]);

    React.useEffect(() => {
        const form = inputRef.current?.form;
        if (!form) return;

        const handleReset = () => reset();

        form.addEventListener('reset', handleReset);

        return () => form.removeEventListener('reset', handleReset);
    }, [name]);

    if (!name) return null;

    return <input ref={inputRef} type='hidden' name={name} value={state} disabled={disabled} />;
}

export type { ValuePluginProps };
export { ValuePlugin };
