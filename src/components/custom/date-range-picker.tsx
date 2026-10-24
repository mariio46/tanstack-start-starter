import * as React from 'react';

import { IconCalendar } from '@tabler/icons-react';
import { endOfDay, startOfDay } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn, formatDate } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

type DateRangePickerProps = {
    value: DateRange;
    onApply: (value: DateRange) => void;
    placeholder?: string;
    className?: string;
};

const DEFAULT_PLACEHOLDER = 'Pilih rentang tanggal';

const toTriggerLabel = ({ from, to }: DateRange, placeholder: string = DEFAULT_PLACEHOLDER) => {
    if (!from && !to) return placeholder;
    if (from && !to) return `Dari ${formatDate(from)}`;
    if (!from && to) return `Sampai ${formatDate(to)}`;

    return `${formatDate(from as Date)} – ${formatDate(to as Date)}`;
};

const DateRangePicker = ({ value, onApply, placeholder, className }: DateRangePickerProps) => {
    const isMobile = useIsMobile();

    const [open, setOpen] = React.useState(false);
    const [draft, setDraft] = React.useState<DateRange | undefined>(value);

    const openChange = (next: boolean) => {
        if (next) setDraft(value);

        setOpen(next);
    };

    const apply = () => {
        if (!draft?.from || !draft.to) return;

        onApply({ from: startOfDay(draft.from), to: endOfDay(draft.to) });
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={openChange}>
            <PopoverTrigger render={<Button variant='outline' size='sm' className={cn('rounded-full', className)} />}>
                <IconCalendar />
                <span>{toTriggerLabel(value, placeholder)}</span>
            </PopoverTrigger>

            <PopoverContent align='end' className='w-auto flex-col gap-0 p-0'>
                <Calendar
                    mode='range'
                    numberOfMonths={isMobile ? 1 : 2}
                    defaultMonth={value.from}
                    selected={draft}
                    onSelect={setDraft}
                    disabled={{ after: new Date() }}
                    autoFocus
                    showOutsideDays={false}
                    className='[--cell-size:--spacing(9)]'
                />

                <Separator />

                <div className='flex items-center justify-between gap-4 p-2'>
                    <span className='text-muted-foreground text-xs'>
                        {draft ? toTriggerLabel(draft) : DEFAULT_PLACEHOLDER}
                    </span>
                    <div className='flex items-center gap-2'>
                        <Button variant='ghost' size='sm' onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button size='sm' disabled={!draft?.from || !draft.to} onClick={apply}>
                            Terapkan
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export type { DateRangePickerProps };
export { DateRangePicker };
