import * as React from 'react';

import { type AnyFormApi, useSelector } from '@tanstack/react-form';
import { useBlocker } from '@tanstack/react-router';

import { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import type { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { IconAlertTriangle } from '@tabler/icons-react';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type FormState = AnyFormApi['state'];

type BlockableForm = Pick<AnyFormApi, 'store' | 'state'>;

interface FormBlockerHost {
    isBlockedRef: React.RefObject<(() => boolean) | null>;
    close: VoidFunction;
}

interface FormBlockerEventDetails {
    reason: string;
    cancel: VoidFunction;
}

interface UseFormBlockerOptions {
    when?: (state: FormState) => boolean;
}

interface PendingDiscard {
    promise: Promise<boolean>;
    resolve: (discard: boolean) => void;
}

const formBlockerAlertDialogHandler = AlertDialogPrimitive.createHandle();

let pending: PendingDiscard | null = null;

function createPendingDiscard(): PendingDiscard {
    let resolve: PendingDiscard['resolve'] = () => {};

    const promise = new Promise<boolean>((resolver) => {
        resolve = resolver;
    });

    return { promise, resolve };
}

function confirmDiscardChanges(): Promise<boolean> {
    if (!pending) {
        pending = createPendingDiscard();
        formBlockerAlertDialogHandler.open(null);
    }

    return pending.promise;
}

function settleDiscardChanges(discard: boolean) {
    const settled = pending;

    pending = null;
    settled?.resolve(discard);
}

const FormBlockerAlertDialog = () => {
    const discardRef = React.useRef(false);

    return (
        <AlertDialog
            handle={formBlockerAlertDialogHandler}
            onOpenChangeComplete={(open) => {
                if (open) return;

                const discard = discardRef.current;

                discardRef.current = false;
                settleDiscardChanges(discard);
            }}
        >
            <AlertDialogContent size='sm'>
                <AlertDialogHeader>
                    <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
                        <IconAlertTriangle />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Buang perubahan?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ada perubahan yang belum disimpan. Jika kamu lanjut, perubahan tersebut akan hilang.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Lanjut mengedit</AlertDialogCancel>
                    <AlertDialogCancel
                        variant='destructive'
                        onClick={() => {
                            discardRef.current = true;
                        }}
                    >
                        Buang
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const FormBlockerContext = React.createContext<FormBlockerHost | null>(null);

function useFormBlockerHost(blockedReasons: readonly string[]) {
    const isBlockedRef = React.useRef<(() => boolean) | null>(null);
    const actionsRef = React.useRef<DialogPrimitive.Root.Actions | null>(null);

    const close = () => actionsRef.current?.close();

    const intercept = (open: boolean, eventDetails: FormBlockerEventDetails) => {
        if (open || !isBlockedRef.current?.() || !blockedReasons.includes(eventDetails.reason)) return false;

        eventDetails.cancel();
        void confirmDiscardChanges().then((discard) => {
            if (discard) close();
        });

        return true;
    };

    const host: FormBlockerHost = { isBlockedRef, close };

    return { host, actionsRef, intercept };
}

const isFormDirty = (state: FormState) => state.isDirty;

function useFormBlocker(form: BlockableForm, { when = isFormDirty }: UseFormBlockerOptions = {}) {
    const host = React.useContext(FormBlockerContext);
    const blocked = useSelector(form.store, when);

    React.useEffect(() => {
        if (!host) return;

        host.isBlockedRef.current = () => when(form.state);

        return () => {
            host.isBlockedRef.current = null;
        };
    }, [host, form, when]);

    useBlocker({
        disabled: !blocked,
        enableBeforeUnload: false,
        shouldBlockFn: async ({ current, next }) => {
            if (current.pathname === next.pathname || !when(form.state)) return false;

            const discard = await confirmDiscardChanges();

            if (discard) host?.close();

            return !discard;
        },
    });
}

export type { BlockableForm, FormBlockerHost };
export { confirmDiscardChanges, FormBlockerAlertDialog, FormBlockerContext, useFormBlocker, useFormBlockerHost };
