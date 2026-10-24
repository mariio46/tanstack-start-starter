import * as React from 'react';

import type { QueryStatus } from '@tanstack/react-query';
import { ClientOnly } from '@tanstack/react-router';

import {
    IconBroadcastOff,
    IconCalendar,
    IconClock,
    IconEye,
    IconEyeOff,
    IconSelector,
    IconX,
} from '@tabler/icons-react';
import type { Matcher } from 'react-day-picker';

import { useBoolean } from '@/hooks/use-boolean';
import { cn, formatDate, toDateValue } from '@/lib/utils';

import { CheckboxGroup } from '@/components/coss-ui/checkbox-group';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/coss-ui/field';
import { FileUpload as CustomFileUpload, type FileUploadProps } from '@/components/custom/file-upload';
import { IconTile } from '@/components/reui/icon-tile';
import type { RichTextEditorProps } from '@/components/rich-text-editor/rich-text-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import {
    Combobox as ShadcnCombobox,
    ComboboxChip as ShadcnComboboxChip,
    ComboboxChips as ShadcnComboboxChips,
    ComboboxChipsInput as ShadcnComboboxChipsInput,
    ComboboxContent as ShadcnComboboxContent,
    ComboboxEmpty as ShadcnComboboxEmpty,
    ComboboxInput as ShadcnComboboxInput,
    ComboboxItem as ShadcnComboboxItem,
    ComboboxList as ShadcnComboboxList,
    ComboboxTrigger as ShadcnComboboxTrigger,
    ComboboxValue as ShadcnComboboxValue,
    useComboboxAnchor,
} from '@/components/ui/combobox';
import { Input as ShadcnInput } from '@/components/ui/input';
import { InputFile as ShadcnInputFile } from '@/components/ui/input-file';
import {
    InputGroup as ShadcnInputGroup,
    InputGroupAddon as ShadcnInputGroupAddon,
    InputGroupInput as ShadcnInputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import {
    Popover as ShadcnPopover,
    PopoverContent as ShadcnPopoverContent,
    PopoverTrigger as ShadcnPopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup as ShadcnRadioGroup, RadioGroupItem as ShadcnRadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';

import { useFieldContext } from './context';

const LazyRichTextEditor = React.lazy(() =>
    import('@/components/rich-text-editor/rich-text-editor').then((module) => ({
        default: module.RichTextEditor,
    })),
);

const Input = ({
    label,
    disabled,
    ...props
}: React.ComponentProps<typeof ShadcnInput> & { label: React.ReactNode }) => {
    const field = useFieldContext<string>();

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>
            <ShadcnInput
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                disabled={disabled}
                {...props}
            />
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const Textarea = ({
    label,
    disabled,
    ...props
}: React.ComponentProps<typeof ShadcnTextarea> & { label: React.ReactNode }) => {
    const field = useFieldContext<string>();

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>
            <ShadcnTextarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={!field.state.meta.isValid}
                disabled={disabled}
                {...props}
            />
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const RichTextEditor = ({
    label,
    disabled,
    className,
    ...props
}: Omit<RichTextEditorProps, 'value' | 'defaultValue' | 'onValueChange' | 'name'> & {
    label: React.ReactNode;
}) => {
    const field = useFieldContext<string>();
    const labelId = React.useId();
    const errorId = React.useId();

    const invalid = !field.state.meta.isValid;
    const fallback = <Skeleton className={cn('h-80 w-full rounded-lg', className)} />;

    return (
        <Field
            name={field.name}
            invalid={invalid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
            className='min-w-0 items-stretch'
        >
            <FieldLabel id={labelId} nativeLabel={false} render={<div />}>
                {label}
            </FieldLabel>
            <ClientOnly fallback={fallback}>
                <React.Suspense fallback={fallback}>
                    <LazyRichTextEditor
                        value={field.state.value}
                        onValueChange={field.handleChange}
                        onBlur={field.handleBlur}
                        invalid={invalid}
                        disabled={disabled}
                        aria-labelledby={labelId}
                        aria-describedby={invalid ? errorId : undefined}
                        className={className}
                        {...props}
                    />
                </React.Suspense>
            </ClientOnly>
            <FieldError id={errorId} match={invalid}>
                {field.state.meta.errors[0]?.message}
            </FieldError>
        </Field>
    );
};

const Checkbox = ({
    label,
    description,
    disabled,
}: {
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
}) => {
    const field = useFieldContext<boolean>();

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <Label className='flex items-start gap-2 rounded-lg border p-3 hover:border-primary/40 hover:bg-primary/8 has-data-checked:border-primary/48 has-data-checked:bg-primary/10'>
                <ShadcnCheckbox
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    onBlur={field.handleBlur}
                    disabled={disabled}
                />
                <div className='flex flex-col gap-1'>
                    <p>{label}</p>
                    {description && (
                        <p className='font-normal text-muted-foreground text-xs leading-normal'>{description}</p>
                    )}
                </div>
            </Label>
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const CheckboxCards = ({
    label,
    items,
    className,
    disabled,
}: {
    label: React.ReactNode;
    items: Array<{ value: string; label: string; description?: string; icon?: React.ComponentType }>;
    className?: string;
    disabled?: boolean;
}) => {
    const field = useFieldContext<string[]>();

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>
            <CheckboxGroup
                value={field.state.value}
                onValueChange={field.handleChange}
                disabled={disabled}
                className={cn('grid grid-cols-1 sm:grid-cols-3 w-full', className)}
            >
                {items.map((item) => (
                    <Label
                        key={item.value}
                        className='flex items-start gap-2 rounded-lg border p-3 hover:bg-primary/8 hover:border-primary/40 has-data-checked:border-primary/48 has-data-checked:bg-primary/10'
                    >
                        <div className='flex flex-row items-center gap-1'>
                            {item.icon && (
                                <IconTile variant='elevated' size='sm' aria-hidden='true'>
                                    <item.icon />
                                </IconTile>
                            )}
                            <div className='flex flex-col gap-1'>
                                <p>{item.label}</p>
                                {item.description && (
                                    <p className='text-muted-foreground text-xs'>{item.description}</p>
                                )}
                            </div>
                        </div>
                        <ShadcnCheckbox value={item.value} className='ms-auto' />
                    </Label>
                ))}
            </CheckboxGroup>
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

type CheckboxGroupsOption = {
    value: string;
    label: string;
    items: Array<{ value: string; label: string }>;
};

const CHECKBOX_GROUPS_SKELETONS = ['first', 'second', 'third'];

const CheckboxGroups = ({
    label,
    groups,
    searchPlaceholder = 'Cari',
    emptyMessage = 'Tidak ada item yang cocok.',
    disabled = false,
}: {
    label: React.ReactNode;
    groups: Array<CheckboxGroupsOption> | undefined;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
}) => {
    const field = useFieldContext<string[]>();
    const [search, setSearch] = React.useState('');

    const isDisabled = !groups || disabled;
    const selected = field.state.value ?? [];
    const keyword = search.trim().toLowerCase();

    const visibleGroups = (groups ?? [])
        .map((group) => ({
            ...group,
            visibleItems:
                !keyword || group.label.toLowerCase().includes(keyword)
                    ? group.items
                    : group.items.filter((item) => item.label.toLowerCase().includes(keyword)),
        }))
        .filter((group) => group.visibleItems.length > 0);

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={isDisabled}
        >
            <div className='flex w-full items-center justify-between gap-2'>
                <FieldLabel>{label}</FieldLabel>
                <span className='text-muted-foreground text-xs'>{selected.length} dipilih</span>
            </div>
            <ShadcnInput
                type='search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                autoComplete='off'
                disabled={isDisabled}
            />
            {!groups ? (
                <div className='grid w-full gap-3 rounded-lg border p-3'>
                    {CHECKBOX_GROUPS_SKELETONS.map((name) => (
                        <div key={name} className='grid gap-2'>
                            <Skeleton className='h-4 w-32' />
                            <Skeleton className='h-4 w-full' />
                        </div>
                    ))}
                </div>
            ) : (
                <ScrollArea className='w-full rounded-lg border **:data-[slot=scroll-area-viewport]:max-h-[50vh]'>
                    {visibleGroups.length === 0 ? (
                        <p className='p-6 text-center text-muted-foreground text-sm'>{emptyMessage}</p>
                    ) : (
                        <div className='divide-y'>
                            {visibleGroups.map((group) => {
                                const groupValues = group.items.map((item) => item.value);
                                const groupSelected = selected.filter((value) => groupValues.includes(value));

                                return (
                                    <CheckboxGroup
                                        key={group.value}
                                        aria-label={group.label}
                                        allValues={groupValues}
                                        value={groupSelected}
                                        onValueChange={(next) =>
                                            field.handleChange([
                                                ...selected.filter((value) => !groupValues.includes(value)),
                                                ...next,
                                            ])
                                        }
                                        disabled={isDisabled}
                                        className='w-full gap-3 p-3'
                                    >
                                        <Label className='flex w-full items-center gap-2 font-medium'>
                                            <ShadcnCheckbox
                                                parent
                                                indeterminate={
                                                    groupSelected.length > 0 &&
                                                    groupSelected.length < groupValues.length
                                                }
                                            />
                                            <span>{group.label}</span>
                                            <span className='ms-auto font-normal text-muted-foreground text-xs'>
                                                {groupSelected.length}/{groupValues.length}
                                            </span>
                                        </Label>
                                        <div className='grid w-full grid-cols-2 gap-2 ps-6 sm:grid-cols-3'>
                                            {group.visibleItems.map((item) => (
                                                <Label key={item.value} className='flex items-center gap-2 font-normal'>
                                                    <ShadcnCheckbox value={item.value} />
                                                    <span className='truncate'>{item.label}</span>
                                                </Label>
                                            ))}
                                        </div>
                                    </CheckboxGroup>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            )}
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const InputPassword = ({
    label,
    disabled,
    ...props
}: React.ComponentProps<typeof ShadcnInputGroupInput> & { label: React.ReactNode }) => {
    const { value: isVisible, toggle } = useBoolean();
    const field = useFieldContext<string>();

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>

            <ShadcnInputGroup>
                <ShadcnInputGroupInput
                    type={!isVisible ? 'password' : 'text'}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    {...props}
                />
                <ShadcnInputGroupAddon align='inline-end'>
                    <Button tabIndex={-1} variant='ghost' size='icon-xs' onClick={toggle}>
                        {!isVisible ? <IconEye /> : <IconEyeOff />}
                    </Button>
                </ShadcnInputGroupAddon>
            </ShadcnInputGroup>
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const InputNumber = ({
    label,
    disabled,
    prefix,
    ...props
}: React.ComponentProps<typeof ShadcnInputGroupInput> & { label: React.ReactNode; prefix?: React.ReactNode }) => {
    const field = useFieldContext<number | undefined>();

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>

            <ShadcnInputGroup>
                {prefix ? <ShadcnInputGroupAddon align='inline-start'>{prefix}</ShadcnInputGroupAddon> : null}
                <ShadcnInputGroupInput
                    inputMode='decimal'
                    value={field.state.value ?? ''}
                    onChange={(e) => {
                        const [integer, ...rest] = e.target.value.replace(/[^\d.]/g, '').split('.');
                        const cleaned = rest.length > 0 ? `${integer}.${rest.join('')}` : integer;

                        if (cleaned === '') {
                            field.handleChange(undefined);
                            return;
                        }

                        field.handleChange(Number(cleaned));
                    }}
                    onBlur={field.handleBlur}
                    disabled={disabled}
                    {...props}
                />
            </ShadcnInputGroup>
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const InputFile = ({
    label,
    disabled,
    ...props
}: Omit<React.ComponentProps<typeof ShadcnInputFile>, 'value' | 'defaultValue' | 'onValueChange'> & {
    label: React.ReactNode;
}) => {
    const field = useFieldContext<File[]>();

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>
            <ShadcnInputFile
                value={field.state.value}
                onValueChange={(files) => {
                    field.handleChange(files);
                    field.handleBlur();
                }}
                invalid={!field.state.meta.isValid}
                disabled={disabled}
                {...props}
            />
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const FileUpload = ({
    label,
    disabled,
    ...props
}: Omit<FileUploadProps, 'value' | 'onChange'> & { label: React.ReactNode; disabled?: boolean }) => {
    const field = useFieldContext<File[]>();

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>
            <CustomFileUpload.Root
                value={field.state.value}
                onChange={(files) => {
                    field.handleChange(files);
                    field.handleBlur();
                }}
                {...props}
            />
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const InputGroup = ({
    label,
    disabled,
    addon,
    ...props
}: React.ComponentProps<typeof ShadcnInputGroupInput> & { label: React.ReactNode; addon?: React.ReactNode }) => {
    const field = useFieldContext<string>();

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>

            <ShadcnInputGroup>
                <ShadcnInputGroupInput
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    {...props}
                />
                {addon}
            </ShadcnInputGroup>
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

type ComboboxOption = { label: string; value: string };

type ComboboxSync = {
    async: false;
    disabled?: boolean;
};

type ComboboxAsync = {
    async: true;
    status: QueryStatus;
    disabled: boolean;
};

type ComboboxProps = {
    items?: ReadonlyArray<ComboboxOption>;
    label: string;
    onChange?: (value: string) => void;
} & (ComboboxAsync | ComboboxSync);

const Combobox = ({ label, items, onChange, disabled = false, ...props }: ComboboxProps) => {
    const field = useFieldContext<string>();

    const isDisabled = !items || disabled;

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={isDisabled}
        >
            <FieldLabel>{label}</FieldLabel>
            <ShadcnCombobox
                items={items}
                value={field.state.value}
                onValueChange={(e) => {
                    if (e) {
                        const newValue = e !== field.state.value ? e : '';
                        field.handleChange(newValue);
                        onChange?.(newValue);
                    }
                }}
                autoHighlight
            >
                <ShadcnComboboxTrigger
                    showIcon={false}
                    render={<Button variant='outline' className='w-full justify-between font-normal' />}
                >
                    <ShadcnComboboxValue>
                        {(value: string) => (
                            <span>
                                {value
                                    ? items?.find((item) => item.value === value)?.label ||
                                      `Pilih ${label.toLowerCase()}`
                                    : `Pilih ${label.toLowerCase()}`}
                            </span>
                        )}
                    </ShadcnComboboxValue>
                    {props.async ? (
                        props.status === 'pending' ? (
                            <Spinner className='-me-1! pointer-events-none size-4 text-muted-foreground' />
                        ) : props.status === 'error' ? (
                            <IconBroadcastOff className='-me-1! pointer-events-none size-4 text-muted-foreground' />
                        ) : (
                            <IconSelector className='-me-1! pointer-events-none size-4 text-muted-foreground' />
                        )
                    ) : (
                        <IconSelector className='-me-1! pointer-events-none size-4 text-muted-foreground' />
                    )}
                </ShadcnComboboxTrigger>
                <ShadcnComboboxContent>
                    <div className='border-b p-2'>
                        <ShadcnComboboxInput showTrigger={false} placeholder='Cari' />
                    </div>
                    <ShadcnComboboxEmpty>Tidak ada item.</ShadcnComboboxEmpty>
                    <ShadcnComboboxList>
                        {(item: ComboboxOption) => (
                            <ShadcnComboboxItem key={item.value} value={item.value}>
                                {item.label}
                            </ShadcnComboboxItem>
                        )}
                    </ShadcnComboboxList>
                </ShadcnComboboxContent>
            </ShadcnCombobox>

            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

type ComboboxMultipleProps = {
    items?: ReadonlyArray<ComboboxOption>;
    label: string;
    onChange?: (value: string[]) => void;
} & (ComboboxAsync | ComboboxSync);

const ComboboxMultiple = ({ label, items, onChange, disabled = false, ...props }: ComboboxMultipleProps) => {
    const field = useFieldContext<string[]>();
    const anchor = useComboboxAnchor();

    const isDisabled = !items || disabled;
    const selected = field.state.value ?? [];

    const optionLabel = (value: string) => items?.find((item) => item.value === value)?.label ?? value;

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={isDisabled}
        >
            <FieldLabel>{label}</FieldLabel>
            <ShadcnCombobox
                multiple
                items={items}
                value={selected}
                onValueChange={(value: string[]) => {
                    field.handleChange(value);
                    onChange?.(value);
                }}
                disabled={isDisabled}
                autoHighlight
            >
                <ShadcnComboboxChips ref={anchor} className='w-full'>
                    <ShadcnComboboxValue>
                        {(value: string[]) =>
                            value.map((item) => (
                                <ShadcnComboboxChip key={item} aria-label={optionLabel(item)}>
                                    {optionLabel(item)}
                                </ShadcnComboboxChip>
                            ))
                        }
                    </ShadcnComboboxValue>
                    <ShadcnComboboxChipsInput placeholder={selected.length ? '' : `Pilih ${label.toLowerCase()}`} />
                    {props.async ? (
                        props.status === 'pending' ? (
                            <Spinner className='pointer-events-none size-4 text-muted-foreground' />
                        ) : props.status === 'error' ? (
                            <IconBroadcastOff className='pointer-events-none size-4 text-muted-foreground' />
                        ) : (
                            <IconSelector className='pointer-events-none size-4 text-muted-foreground' />
                        )
                    ) : (
                        <IconSelector className='pointer-events-none size-4 text-muted-foreground' />
                    )}
                </ShadcnComboboxChips>
                <ShadcnComboboxContent anchor={anchor}>
                    <ShadcnComboboxEmpty>Tidak ada item.</ShadcnComboboxEmpty>
                    <ShadcnComboboxList>
                        {(item: ComboboxOption) => (
                            <ShadcnComboboxItem key={item.value} value={item.value}>
                                {item.label}
                            </ShadcnComboboxItem>
                        )}
                    </ShadcnComboboxList>
                </ShadcnComboboxContent>
            </ShadcnCombobox>

            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const CALENDAR_FUTURE_YEARS = 100;

const InputDate = ({
    label,
    disabled,
    minDate,
    maxDate,
    ...props
}: React.ComponentProps<typeof ShadcnInputGroupInput> & {
    label: React.ReactNode;
    minDate?: Date;
    maxDate?: Date;
}) => {
    const field = useFieldContext<string>();

    const disabledDates = [minDate ? { before: minDate } : undefined, maxDate ? { after: maxDate } : undefined].filter(
        (matcher) => matcher !== undefined,
    );

    const endMonth = maxDate ?? new Date(new Date().getFullYear() + CALENDAR_FUTURE_YEARS, 11);

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>
            <ShadcnPopover>
                <ShadcnInputGroup>
                    <ShadcnInputGroupInput
                        type='date'
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        min={minDate ? toDateValue(minDate) : undefined}
                        max={maxDate ? toDateValue(maxDate) : undefined}
                        className='[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none data-[selected=true]:text-foreground data-[selected=false]:text-muted-foreground'
                        {...props}
                    />
                    <ShadcnInputGroupAddon>
                        <ShadcnPopoverTrigger
                            id={field.name}
                            onBlur={field.handleBlur}
                            data-selected={!!field.state.value}
                            aria-label='Pilih tanggal'
                            render={
                                <Button
                                    tabIndex={-1}
                                    aria-label='Pilih tanggal'
                                    size='icon-xs'
                                    className='data-[selected=true]:text-foreground data-[selected=false]:text-muted-foreground'
                                    variant='ghost'
                                />
                            }
                        >
                            <IconCalendar aria-hidden='true' />
                        </ShadcnPopoverTrigger>
                    </ShadcnInputGroupAddon>
                    {!!field.state.value && (
                        <ShadcnInputGroupAddon align='inline-end'>
                            <Button
                                tabIndex={-1}
                                onClick={() => field.handleChange('')}
                                aria-label='Hapus tanggal'
                                size='icon-xs'
                                variant='ghost'
                            >
                                <IconX aria-hidden='true' />
                            </Button>
                        </ShadcnInputGroupAddon>
                    )}
                </ShadcnInputGroup>
                <ShadcnPopoverContent align='start' alignOffset={-4} sideOffset={8} className='w-full'>
                    <Calendar
                        className='[--cell-size:--spacing(9)]'
                        mode='single'
                        defaultMonth={field.state.value ? new Date(field.state.value) : undefined}
                        disabled={disabledDates}
                        endMonth={endMonth}
                        onSelect={(date) => {
                            if (date) {
                                field.handleChange(toDateValue(date));
                            }
                        }}
                        selected={field.state.value ? new Date(field.state.value) : undefined}
                        captionLayout='dropdown'
                    />
                </ShadcnPopoverContent>
            </ShadcnPopover>
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const InputDateTime = ({
    label,
    disabled,
    minDate,
    maxDate,
}: {
    label: React.ReactNode;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
}) => {
    const field = useFieldContext<string>();

    const [date = '', time = ''] = field.state.value ? field.state.value.split('T') : [];
    const selectedDate = date ? new Date(`${date}T00:00`) : undefined;

    const disabledDates = [minDate ? { before: minDate } : undefined, maxDate ? { after: maxDate } : undefined].filter(
        (matcher) => matcher !== undefined,
    );

    const endMonth = maxDate ?? new Date(new Date().getFullYear() + CALENDAR_FUTURE_YEARS, 11);

    const changeDate = (value: string) => {
        field.handleChange(value ? `${value}T${time || '00:00'}` : '');
    };

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>
            <div className='flex w-full gap-2'>
                <ShadcnPopover>
                    <ShadcnInputGroup className='flex-1'>
                        <ShadcnInputGroupInput
                            type='date'
                            value={date}
                            onChange={(e) => changeDate(e.target.value)}
                            onBlur={field.handleBlur}
                            min={minDate ? toDateValue(minDate) : undefined}
                            max={maxDate ? toDateValue(maxDate) : undefined}
                            disabled={disabled}
                            className='[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                        />
                        <ShadcnInputGroupAddon>
                            <ShadcnPopoverTrigger
                                id={field.name}
                                onBlur={field.handleBlur}
                                data-selected={!!date}
                                aria-label='Pilih tanggal'
                                render={
                                    <Button
                                        tabIndex={-1}
                                        aria-label='Pilih tanggal'
                                        size='icon-xs'
                                        className='data-[selected=true]:text-foreground data-[selected=false]:text-muted-foreground'
                                        variant='ghost'
                                    />
                                }
                            >
                                <IconCalendar aria-hidden='true' />
                            </ShadcnPopoverTrigger>
                        </ShadcnInputGroupAddon>
                        {!!field.state.value && (
                            <ShadcnInputGroupAddon align='inline-end'>
                                <Button
                                    tabIndex={-1}
                                    onClick={() => field.handleChange('')}
                                    aria-label='Hapus tanggal dan jam'
                                    size='icon-xs'
                                    variant='ghost'
                                >
                                    <IconX aria-hidden='true' />
                                </Button>
                            </ShadcnInputGroupAddon>
                        )}
                    </ShadcnInputGroup>
                    <ShadcnPopoverContent align='start' alignOffset={-4} sideOffset={8} className='w-full'>
                        <Calendar
                            className='[--cell-size:--spacing(9)]'
                            mode='single'
                            defaultMonth={selectedDate}
                            disabled={disabledDates}
                            endMonth={endMonth}
                            onSelect={(value) => {
                                if (value) {
                                    changeDate(toDateValue(value));
                                }
                            }}
                            selected={selectedDate}
                            captionLayout='dropdown'
                        />
                    </ShadcnPopoverContent>
                </ShadcnPopover>
                <ShadcnInputGroup className='w-32 shrink-0'>
                    <ShadcnInputGroupInput
                        type='time'
                        value={time}
                        onChange={(e) => field.handleChange(`${date}T${e.target.value}`)}
                        onBlur={field.handleBlur}
                        disabled={disabled || !date}
                        aria-label='Jam'
                        className='[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                    />
                    <ShadcnInputGroupAddon>
                        <IconClock aria-hidden='true' />
                    </ShadcnInputGroupAddon>
                </ShadcnInputGroup>
            </div>
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const InputDateMultiple = ({
    label,
    description,
    disabled,
    minDate,
    max,
    disabledDates = [],
    placeholder = 'Pilih tanggal',
}: {
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
    minDate?: Date;
    max?: number;
    disabledDates?: Matcher[];
    placeholder?: string;
}) => {
    const field = useFieldContext<string[]>();

    const selectedDates = field.state.value.map((date) => new Date(`${date}T00:00`));
    const matchers = minDate ? [{ before: minDate }, ...disabledDates] : disabledDates;
    const endMonth = new Date(new Date().getFullYear() + CALENDAR_FUTURE_YEARS, 11);

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>
            <ShadcnPopover>
                <ShadcnPopoverTrigger
                    id={field.name}
                    onBlur={field.handleBlur}
                    disabled={disabled}
                    data-selected={selectedDates.length > 0}
                    render={
                        <Button
                            variant='outline'
                            className='w-full justify-start font-normal data-[selected=false]:text-muted-foreground'
                        />
                    }
                >
                    <IconCalendar aria-hidden='true' />
                    {selectedDates.length > 0 ? `${selectedDates.length} tanggal dipilih` : placeholder}
                </ShadcnPopoverTrigger>
                <ShadcnPopoverContent align='start' sideOffset={8} className='w-full'>
                    <Calendar
                        className='[--cell-size:--spacing(9)]'
                        mode='multiple'
                        max={max}
                        defaultMonth={selectedDates[0]}
                        disabled={matchers}
                        endMonth={endMonth}
                        onSelect={(dates) => field.handleChange((dates ?? []).map(toDateValue).sort())}
                        selected={selectedDates}
                        captionLayout='dropdown'
                    />
                </ShadcnPopoverContent>
            </ShadcnPopover>
            {field.state.value.length > 0 && (
                <div className='flex w-full flex-wrap gap-1.5'>
                    {field.state.value.map((date) => (
                        <Badge key={date} variant='outline'>
                            {formatDate(new Date(`${date}T00:00`))}
                            <button
                                type='button'
                                data-icon='inline-end'
                                disabled={disabled}
                                onClick={() => field.handleChange(field.state.value.filter((value) => value !== date))}
                                aria-label='Hapus tanggal'
                                className='-mr-0.5 rounded-full text-muted-foreground hover:text-foreground disabled:pointer-events-none'
                            >
                                <IconX aria-hidden='true' className='size-3' />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

const RadioCards = ({
    label,
    items,
    className,
    disabled,
}: {
    label: React.ReactNode;
    items: ReadonlyArray<{ value: string; label: string; description?: string }>;
    className?: string;
    disabled?: boolean;
}) => {
    const field = useFieldContext<string>();

    return (
        <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            dirty={field.state.meta.isDirty}
            touched={field.state.meta.isTouched}
            disabled={disabled}
        >
            <FieldLabel>{label}</FieldLabel>
            <ShadcnRadioGroup
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as string)}
                disabled={disabled}
                className={cn('grid w-full grid-cols-1 sm:grid-cols-3', className)}
            >
                {items.map((item) => (
                    <Label
                        key={item.value}
                        className='flex items-start gap-2 rounded-lg border p-3 hover:border-primary/40 hover:bg-primary/8 has-data-checked:border-primary/48 has-data-checked:bg-primary/10'
                    >
                        <ShadcnRadioGroupItem value={item.value} onBlur={field.handleBlur} />
                        <div className='flex flex-col gap-1'>
                            <p>{item.label}</p>
                            {item.description && (
                                <p className='font-normal text-muted-foreground text-xs leading-normal'>
                                    {item.description}
                                </p>
                            )}
                        </div>
                    </Label>
                ))}
            </ShadcnRadioGroup>
            <FieldError match={!field.state.meta.isValid}>{field.state.meta.errors[0]?.message}</FieldError>
        </Field>
    );
};

export {
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
};
