import { type JsonValue, JsonViewer, type JsonViewerProps } from '@/components/custom/json-viewer';

type SubmittedValueProps = {
    value: JsonValue | undefined;
    defaultExpanded?: JsonViewerProps['defaultExpanded'];
};

const SubmittedValue = ({ value, defaultExpanded = true }: SubmittedValueProps) => {
    return (
        <div className='grid min-w-0 content-start gap-2'>
            <span className='font-medium text-sm/4'>Nilai yang di-submit</span>
            {value === undefined ? (
                <p className='rounded-lg border border-dashed p-4 text-muted-foreground text-sm'>
                    Belum ada data. Isi form lalu tekan Simpan.
                </p>
            ) : (
                <JsonViewer
                    key={JSON.stringify(value)}
                    data={value}
                    rootName='value'
                    defaultExpanded={defaultExpanded}
                />
            )}
        </div>
    );
};

export { SubmittedValue };
