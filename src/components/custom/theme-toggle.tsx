import { IconBrightness } from '@tabler/icons-react';

import { useTheme } from '@/integrations/theme/provider';

import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
    const { setTheme } = useTheme();

    function toggleTheme() {
        setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
    }

    return (
        <Button variant='ghost' size='icon' className='text-foreground size-7' onClick={toggleTheme}>
            <IconBrightness />
            <span className='sr-only'>Ganti Tema</span>
        </Button>
    );
};

export { ThemeToggle };
