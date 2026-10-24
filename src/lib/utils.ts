export { cn } from 'cn';

export function fallback<T, R = T>(value: T, render?: (value: NonNullable<T>) => R, empty: string = '—') {
    if (value === '' || value === null || value === undefined) return empty;

    return render ? render(value as NonNullable<T>) : value;
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

export function formatDate(value: string | number | Date) {
    return dateFormatter.format(new Date(value));
}

const dateValueFormatter = new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

export function toDateValue(value: string | number | Date) {
    return dateValueFormatter.format(new Date(value));
}
