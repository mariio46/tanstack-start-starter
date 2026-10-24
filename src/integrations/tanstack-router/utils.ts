import { env } from '@/integrations/t3-oss/env';

export function meta({ title }: { title: string }) {
    return [{ title: `${title} - ${env.VITE_APP_TITLE}` }];
}
