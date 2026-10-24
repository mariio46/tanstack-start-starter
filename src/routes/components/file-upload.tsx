import { createFileRoute } from '@tanstack/react-router';

import { meta } from '@/integrations/tanstack-router/utils';

import { FileUploadMain } from '@/features/components/file-upload/index/main';

export const Route = createFileRoute('/components/file-upload')({
    component: FileUploadPage,
    staticData: {
        breadcrumb: 'File Upload',
    },
    head: () => ({
        meta: meta({ title: 'File Upload' }),
    }),
});

function FileUploadPage() {
    return <FileUploadMain />;
}
