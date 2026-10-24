import type { Dialog as SheetPrimitive } from '@base-ui/react/dialog';

import { FormBlockerContext, useFormBlockerHost } from '@/components/custom/form-blocker';
import { Sheet } from '@/components/ui/sheet';

const BLOCKED_REASONS: SheetPrimitive.Root.ChangeEventReason[] = ['close-press', 'escape-key', 'outside-press'];

function FormBlockerSheet<Payload>({ onOpenChange, ...props }: Omit<SheetPrimitive.Root.Props<Payload>, 'actionsRef'>) {
    const { host, actionsRef, intercept } = useFormBlockerHost(BLOCKED_REASONS);

    return (
        <FormBlockerContext.Provider value={host}>
            <Sheet<Payload>
                {...props}
                actionsRef={actionsRef}
                onOpenChange={(open, eventDetails) => {
                    if (intercept(open, eventDetails)) return;

                    onOpenChange?.(open, eventDetails);
                }}
            />
        </FormBlockerContext.Provider>
    );
}

export { FormBlockerSheet };
