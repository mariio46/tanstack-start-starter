interface SpeechRecognitionInstance extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
    abort(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionWindow = Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
    if (typeof window === 'undefined') return null;

    const speechWindow = window as SpeechRecognitionWindow;

    return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

export type { SpeechRecognitionConstructor, SpeechRecognitionInstance };
export { getSpeechRecognition };
