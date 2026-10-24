import * as React from 'react';

interface UseControllableStateParams<T> {
    value?: T;
    defaultValue: T;
    onChange?: (value: T) => void;
}

export function useControllableState<T>({
    value,
    defaultValue,
    onChange,
}: UseControllableStateParams<T>): [T, (next: T) => void] {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);

    const isControlled = value !== undefined;
    const state = isControlled ? value : uncontrolled;

    const setState = React.useCallback(
        (next: T) => {
            if (!isControlled) setUncontrolled(next);

            onChange?.(next);
        },
        [isControlled, onChange],
    );

    return [state, setState];
}
