import { Link, type LinkProps, useLocation } from '@tanstack/react-router';

import { ThemeToggle } from '@/components/custom/theme-toggle';
import { Button } from '@/components/ui/button';

const AppNavbar = () => {
    return (
        <header className='sticky top-0 z-30 border-b bg-background/75 backdrop-blur'>
            <div className='flex w-full items-center justify-between gap-4 px-4 py-3'>
                <div className='flex items-center gap-4'>
                    <span className='font-heading font-black text-lg'>TanStack Start</span>
                    <nav className='flex items-center gap-2'>
                        <NavbarLink label='Beranda' to='/' />
                        <NavbarLink label='Components' to='/components' />
                    </nav>
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
};

const NavbarLink = ({ label, to }: { label: string; to: LinkProps['to'] }) => {
    const pathname = useLocation({ select: (state) => state.pathname });
    const isActive = to === '/' ? pathname === to : pathname.startsWith(to ?? '');

    return (
        <Button
            variant={isActive ? 'secondary' : 'ghost'}
            data-active={isActive}
            className='data-[active=true]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]'
            render={<Link to={to} />}
        >
            {label}
        </Button>
    );
};

export { AppNavbar };
