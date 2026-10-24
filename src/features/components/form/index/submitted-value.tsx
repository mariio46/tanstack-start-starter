import { type JsonValue, JsonViewer } from '@/components/custom/json-viewer';

type SubmittedValueProps = {
    value: JsonValue | undefined;
};

const SubmittedValue = ({ value }: SubmittedValueProps) => {
    return (
        <div className='grid content-start gap-2'>
            <span className='font-medium text-sm/4'>Nilai yang di-submit</span>
            {value === undefined ? (
                <p className='rounded-lg border border-dashed p-4 text-muted-foreground text-sm'>
                    Belum ada data. Isi form lalu tekan Simpan.
                </p>
            ) : (
                <JsonViewer data={value} rootName='value' defaultExpanded />
            )}
        </div>
    );
};

export { SubmittedValue };
