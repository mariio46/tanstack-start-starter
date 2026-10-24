import type { AnyFormApi } from '@tanstack/react-form';

export const FORM_ERROR_KEY = 'root';

export function toFormErrorMap(
    {
        message,
        fields,
    }: {
        message: string;
        fields: Record<string, string>;
    },
    renderedFields?: readonly string[],
) {
    const orphaned = renderedFields
        ? Object.entries(fields)
              .filter(([key]) => !renderedFields.includes(key))
              .map(([key, value]) => `${key}: ${value}`)
        : [];

    return {
        form: {
            [FORM_ERROR_KEY]: [{ message: orphaned.length > 0 ? `${message} ${orphaned.join(' ')}` : message }],
        },
        fields: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, [{ message: value }]])),
    };
}

export function toFieldErrors(issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>) {
    const fields: Record<string, string> = {};

    for (const issue of issues) {
        const name = String(issue.path[0]);

        if (!(name in fields)) {
            fields[name] = issue.message;
        }
    }

    return fields;
}

export function setFieldErrors(form: AnyFormApi, fields: Record<string, string>) {
    for (const [name, message] of Object.entries(fields)) {
        if (!form.getFieldMeta(name)) {
            continue;
        }

        form.setFieldMeta(name, (prev: any) => ({
            ...prev,
            errorMap: { ...prev.errorMap, onSubmit: [{ message }] },
            errorSourceMap: { ...prev.errorSourceMap, onSubmit: 'form' },
        }));
    }
}
