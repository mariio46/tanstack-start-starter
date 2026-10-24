import type { Dialog as DialogPrimitive } from '@base-ui/react/dialog';

import { FormBlockerContext, useFormBlockerHost } from '@/components/custom/form-blocker';
import { Dialog } from '@/components/ui/dialog';

const BLOCKED_REASONS: DialogPrimitive.Root.ChangeEventReason[] = ['close-press', 'escape-key', 'outside-press'];

function FormBlockerDialog<Payload>({
    onOpenChange,
    ...props
}: Omit<DialogPrimitive.Root.Props<Payload>, 'actionsRef'>) {
    const { host, actionsRef, intercept } = useFormBlockerHost(BLOCKED_REASONS);

    return (
        <FormBlockerContext.Provider value={host}>
            <Dialog<Payload>
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

export { FormBlockerDialog };
