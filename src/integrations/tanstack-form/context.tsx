import { createFormHook, createFormHookContexts } from '@tanstack/react-form';

import {
    Checkbox,
    CheckboxCards,
    CheckboxGroups,
    Combobox,
    ComboboxMultiple,
    FileUpload,
    Input,
    InputDate,
    InputDateMultiple,
    InputDateTime,
    InputFile,
    InputGroup,
    InputNumber,
    InputPassword,
    RadioCards,
    RichTextEditor,
    Textarea,
} from './fields';
import { AlertError, SubmitButton } from './forms';

export const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts();

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
    fieldComponents: {
        Input,
        InputFile,
        FileUpload,
        InputPassword,
        InputGroup,
        InputNumber,
        Combobox,
        ComboboxMultiple,
        Textarea,
        RichTextEditor,
        InputDate,
        InputDateTime,
        InputDateMultiple,
        Checkbox,
        CheckboxCards,
        CheckboxGroups,
        RadioCards,
    },
    formComponents: {
        SubmitButton,
        AlertError,
    },
    fieldContext,
    formContext,
});
