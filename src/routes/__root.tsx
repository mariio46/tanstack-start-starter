import { TanStackDevtools } from '@tanstack/react-devtools';
import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router';

import type { AppRouterContext } from '@/integrations/tanstack-query/context';
import { TanStackQueryDevtools } from '@/integrations/tanstack-query/devtools';
import { TanStackRouterDevtools } from '@/integrations/tanstack-router/devtools';
import { ThemeProvider } from '@/integrations/theme/provider';

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
                </ThemeProvider>
                <TanStackDevtools
                    config={{
                        position: 'bottom-right',
                    }}
                    plugins={[TanStackRouterDevtools, TanStackQueryDevtools]}
                />
                <Scripts />
            </body>
        </html>
    );
}
