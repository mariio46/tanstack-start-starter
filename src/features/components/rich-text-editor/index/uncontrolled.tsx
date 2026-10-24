import * as React from 'react';

import { parseRichText } from '@/lib/rich-text';

import { type JsonValue, JsonViewer } from '@/components/custom/json-viewer';
import { RichTextEditor } from '@/components/rich-text-editor/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { EXAMPLE_DRAFT_VALUE } from './constants';

const UncontrolledRichTextEditor = () => {
    const [submitted, setSubmitted] = React.useState<JsonValue | null>(null);

    function submit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const content = new FormData(event.currentTarget).get('content');

        setSubmitted((parseRichText(typeof content === 'string' ? content : null) as JsonValue | null) ?? null);
    }

    function reset(event: React.MouseEvent<HTMLButtonElement>) {
        event.currentTarget.form?.reset();
        setSubmitted(null);
    }

    return (
        <div className='grid gap-6 lg:grid-cols-2'>
            <Form
                id='uncontrolled-rich-text-editor-form'
                className='grid min-w-0 content-start gap-4'
                onSubmit={submit}
            >
                <RichTextEditor
                    name='content'
                    defaultValue={EXAMPLE_DRAFT_VALUE}
                    aria-label='Konten'
                    className='h-80'
                />
                <div className='flex items-center gap-2'>
                    <Button type='submit'>Simpan</Button>
                    <Button type='button' variant='outline' onClick={reset}>
                        Reset
                    </Button>
                </div>
            </Form>

            <div className='grid min-w-0 content-start gap-2'>
                <span className='font-medium text-sm/4'>FormData.get('content')</span>
                <JsonViewer key={JSON.stringify(submitted)} data={submitted} rootName='content' defaultExpanded={2} />
            </div>
        </div>
    );
};

export { UncontrolledRichTextEditor };
