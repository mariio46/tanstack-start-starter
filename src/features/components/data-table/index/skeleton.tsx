import { DataTableSkeleton } from '@/components/custom/skeleton';

const SkeletonDataTable = () => {
    return <DataTableSkeleton filters={3} columns={7} rows={5} selectable />;
};

export { SkeletonDataTable };
