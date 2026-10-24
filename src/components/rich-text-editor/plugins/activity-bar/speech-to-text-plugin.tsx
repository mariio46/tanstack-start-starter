import * as React from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { IconMicrophone } from '@tabler/icons-react';
import type { LexicalCommand } from 'lexical';
import { $getRoot, $getSelection, $isRangeSelection, REDO_COMMAND, UNDO_COMMAND } from 'lexical';

import { EditorActivityBarButton } from './editor-activity-bar';
import type { SpeechRecognitionInstance } from './speech-recognition';
import { getSpeechRecognition } from './speech-recognition';

const VOICE_COMMANDS: Record<string, LexicalCommand<void>> = {
    undo: UNDO_COMMAND,
    redo: REDO_COMMAND,
};

function $insertTranscript(transcript: string) {
    const current = $getSelection();
    const selection = $isRangeSelection(current) ? current : $getRoot().selectEnd();

    const { anchor } = selection;
    const before =
        selection.isCollapsed() && anchor.type === 'text'
            ? anchor.getNode().getTextContent().slice(0, anchor.offset)
            : '';
    const needsSpace = before !== '' && !/\s$/.test(before);

    selection.insertText(needsSpace ? ` ${transcript}` : transcript);
}

function SpeechToTextPlugin() {
    const [editor] = useLexicalComposerContext();
    const isEditable = useLexicalEditable();
    const recognitionRef = React.useRef<SpeechRecognitionInstance | null>(null);
    const [isListening, setIsListening] = React.useState(false);

    const SpeechRecognition = getSpeechRecognition();

    const stop = () => recognitionRef.current?.stop();

    const handleTranscript = (transcript: string) => {
        const text = transcript.trim();
        if (!text) return;

        const command = VOICE_COMMANDS[text.toLowerCase()];
        if (command) {
            editor.dispatchCommand(command, undefined);
            return;
        }

        editor.update(() => $insertTranscript(text));
    };

    const start = () => {
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            for (let index = event.resultIndex; index < event.results.length; index += 1) {
                const result = event.results[index];
                if (result.isFinal) handleTranscript(result[0].transcript);
            }
        };
        recognition.onerror = () => undefined;
        recognition.onend = () => {
            if (recognitionRef.current === recognition) recognitionRef.current = null;
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
        editor.focus();
    };

    React.useEffect(
        () =>
            editor.registerEditableListener((editable) => {
                if (!editable) recognitionRef.current?.stop();
            }),
        [editor],
    );

    React.useEffect(() => () => recognitionRef.current?.abort(), []);

    if (!SpeechRecognition) return null;

    return (
        <EditorActivityBarButton
            label='Dikte'
            pressed={isListening}
            disabled={!isEditable}
            onClick={isListening ? stop : start}
            className='aria-pressed:text-destructive'
        >
            <IconMicrophone className={isListening ? 'animate-pulse' : undefined} />
        </EditorActivityBarButton>
    );
}

export { SpeechToTextPlugin };
