import * as React from 'react';

/**
 * Returns a stable function that delays `callback` until `delay` ms have passed
 * without another call. The latest `callback` is kept in a ref, so the returned
 * function never changes identity and never closes over a stale value.
 */
function useDebouncedCallback<TArgs extends unknown[]>(callback: (...args: TArgs) => void, delay: number) {
    const callbackRef = React.useRef(callback);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const delayRef = React.useRef(delay);

    callbackRef.current = callback;
    delayRef.current = delay;

    React.useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return React.useCallback((...args: TArgs) => {
        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => callbackRef.current(...args), delayRef.current);
    }, []);
}

export { useDebouncedCallback };
