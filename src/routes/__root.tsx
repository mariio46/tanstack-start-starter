import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router';

import { TanStackFormDevtools } from '@/integrations/tanstack-form/devtools';
import type { AppRouterContext } from '@/integrations/tanstack-query/context';
import { TanStackQueryDevtools } from '@/integrations/tanstack-query/devtools';
import { TanStackRouterDevtools } from '@/integrations/tanstack-router/devtools';
import { TanStackTableDevtools } from '@/integrations/tanstack-table/devtools';
import { ThemeProvider } from '@/integrations/theme/provider';

import { FormBlockerAlertDialog } from '@/components/custom/form-blocker';

import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext<AppRouterContext>()({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'TanStack Start Starter',
            },
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss,
            },
        ],
    }),
    shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                <ThemeProvider defaultTheme='light' storageKey='theme'>
                    {children}
                    <FormBlockerAlertDialog />
                </ThemeProvider>
                <TanStackDevtools
                    config={{
                        position: 'bottom-right',
                    }}
                    plugins={[
                        TanStackRouterDevtools,
                        TanStackQueryDevtools,
                        TanStackFormDevtools,
                        TanStackTableDevtools,
                    ]}
                />
                <Scripts />
            </body>
        </html>
    );
}
