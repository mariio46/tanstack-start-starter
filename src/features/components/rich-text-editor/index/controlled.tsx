import * as React from 'react';

import { getRichTextLength, isRichTextEmpty, parseRichText } from '@/lib/rich-text';

import { type JsonValue, JsonViewer } from '@/components/custom/json-viewer';
import { richTextToHtml, richTextToMarkdown } from '@/components/rich-text-editor/convert';
import { RichTextEditor } from '@/components/rich-text-editor/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { EXAMPLE_VALUE } from './constants';

const ExportPreview = ({ value, format }: { value: string; format: 'html' | 'markdown' }) => {
    const output = format === 'html' ? richTextToHtml(value) : richTextToMarkdown(value);

    return (
        <pre className='max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md border bg-background p-3 font-mono text-xs'>
            {output || <span className='text-muted-foreground'>Dokumen kosong</span>}
        </pre>
    );
};

const ControlledRichTextEditor = () => {
    const [value, setValue] = React.useState('');

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <RichTextEditor value={value} onValueChange={setValue} aria-label='Konten' className='h-[28rem]' />

            <div className='grid min-w-0 content-start gap-3 rounded-lg border bg-muted/40 p-4'>
                <div className='flex items-center justify-between gap-2'>
                    <span className='font-medium text-sm/4'>State parent</span>
                    <div className='flex items-center gap-2'>
                        <Button variant='outline' size='xs' onClick={() => setValue(EXAMPLE_VALUE)}>
                            Muat contoh
                        </Button>
                        <Button variant='outline' size='xs' disabled={value === ''} onClick={() => setValue('')}>
                            Kosongkan
                        </Button>
                    </div>
                </div>
                <dl className='grid grid-cols-2 gap-2 text-sm'>
                    <dt className='text-muted-foreground'>Kosong</dt>
                    <dd className='text-right'>{isRichTextEmpty(value) ? 'Ya' : 'Tidak'}</dd>
                    <dt className='text-muted-foreground'>Karakter</dt>
                    <dd className='text-right tabular-nums'>{getRichTextLength(value)}</dd>
                </dl>
                <Tabs defaultValue='json'>
                    <TabsList>
                        <TabsTrigger value='json'>JSON</TabsTrigger>
                        <TabsTrigger value='html'>HTML</TabsTrigger>
                        <TabsTrigger value='markdown'>Markdown</TabsTrigger>
                    </TabsList>
                    <TabsContent value='json'>
                        <JsonViewer data={(parseRichText(value) as JsonValue | null) ?? null} rootName='value' />
                    </TabsContent>
                    <TabsContent value='html'>
                        <ExportPreview value={value} format='html' />
                    </TabsContent>
                    <TabsContent value='markdown'>
                        <ExportPreview value={value} format='markdown' />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export { ControlledRichTextEditor };
