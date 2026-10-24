import {
    PageHeader,
    PageHeaderBreadcrumb,
    PageHeaderContent,
    PageHeaderFrame,
    PageHeaderTitle,
} from '@/components/custom/page-header';
import { RouteBreadcrumb } from '@/components/custom/route-breadcrumb';

type ExamplePageProps = Omit<React.ComponentProps<'div'>, 'title'> & {
    title: string;
    description: string;
};

const ExamplePage = ({ title, description, children, ...props }: ExamplePageProps) => (
    <div {...props}>
        <PageHeader className='bg-background border rounded-xl mx-4 mt-4'>
            <PageHeaderFrame>
                <PageHeaderContent className='grid gap-1'>
                    <PageHeaderTitle>{title}</PageHeaderTitle>
                    <p className='text-muted-foreground text-sm'>{description}</p>
                </PageHeaderContent>
            </PageHeaderFrame>

            <PageHeaderBreadcrumb>
                <RouteBreadcrumb />
            </PageHeaderBreadcrumb>
        </PageHeader>

        <div className='grid gap-6 p-4'>{children}</div>
    </div>
);

interface ExampleSectionProps extends Omit<React.ComponentProps<'section'>, 'title'> {
    title: string;
    description: React.ReactNode;
}

const ExampleSection = ({ title, description, children, ...props }: ExampleSectionProps) => (
    <section className='grid gap-4 rounded-xl border bg-card p-4 sm:p-6' {...props}>
        <div className='grid gap-1'>
            <h2 className='font-semibold text-base/5'>{title}</h2>
            <p className='text-muted-foreground text-sm'>{description}</p>
        </div>
        {children}
    </section>
);

export type { ExamplePageProps, ExampleSectionProps };
export { ExamplePage, ExampleSection };
