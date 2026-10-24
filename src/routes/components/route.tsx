import { createFileRoute, Outlet } from '@tanstack/react-router';

import { AppNavbar } from '@/components/custom/app-navbar';

export const Route = createFileRoute('/components')({
    component: ComponentsLayout,
    staticData: {
        breadcrumb: 'Components',
    },
});

function ComponentsLayout() {
    return (
        <div className='min-h-svh bg-muted/30'>
            <AppNavbar />
            <main className='isolate mx-auto w-full max-w-5xl'>
                <Outlet />
            </main>
        </div>
    );
}
