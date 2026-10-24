import type * as React from 'react';

import {
    IconBlockquote,
    IconBold,
    IconBrandYoutube,
    IconCode,
    IconColumnInsertRight,
    IconH1,
    IconH2,
    IconH3,
    IconH4,
    IconItalic,
    IconList,
    IconListNumbers,
    IconMath,
    IconMathFunction,
    IconMinus,
    IconPhotoPlus,
    IconPilcrow,
    IconRowInsertBottom,
    IconSourceCode,
    IconStrikethrough,
    IconTableMinus,
    IconTablePlus,
    IconUnderline,
} from '@tabler/icons-react';
import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { EditorEmbedPopover } from './embed-popover';
import { EditorLinkPopover } from './link-popover';
import { isValidImageUrl, isValidYoutubeUrl } from './markdown-adapters';

type MarkdownEditorToolbarProps = {
    disabled?: boolean;
    editor: Editor | null;
};

type ToolbarButtonProps = {
    active?: boolean;
    disabled?: boolean;
    label: string;
    onClick: () => void;
    children: React.ReactNode;
};

function ToolbarButton({ active, disabled = false, label, onClick, children }: ToolbarButtonProps) {
    return (
        <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            aria-label={label}
            aria-pressed={active}
            title={label}
            disabled={disabled}
            className='aria-pressed:bg-muted aria-pressed:text-foreground'
            onClick={onClick}
        >
            {children}
        </Button>
    );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
    return (
        <div role='group' className='flex items-center gap-0.5'>
            {children}
        </div>
    );
}

function ToolbarSeparator() {
    return <Separator orientation='vertical' className='h-5 data-vertical:self-center' />;
}

function MarkdownEditorToolbar({ disabled = false, editor }: MarkdownEditorToolbarProps) {
    const state = useEditorState({
        editor,
        selector: ({ editor }) =>
            editor && {
                is_bold: editor.isActive('bold'),
                can_bold: editor.can().chain().focus().toggleBold().run(),
                is_italic: editor.isActive('italic'),
                can_italic: editor.can().chain().focus().toggleItalic().run(),
                is_underline: editor.isActive('underline'),
                can_underline: editor.can().chain().focus().toggleUnderline().run(),
                is_strike: editor.isActive('strike'),
                can_strike: editor.can().chain().focus().toggleStrike().run(),
                is_code: editor.isActive('code'),
                can_code: editor.can().chain().focus().toggleCode().run(),
                is_heading: editor.isActive('heading'),
                is_heading_1: editor.isActive('heading', { level: 1 }),
                can_heading_1: editor.can().chain().focus().toggleHeading({ level: 1 }).run(),
                is_heading_2: editor.isActive('heading', { level: 2 }),
                can_heading_2: editor.can().chain().focus().toggleHeading({ level: 2 }).run(),
                is_heading_3: editor.isActive('heading', { level: 3 }),
                can_heading_3: editor.can().chain().focus().toggleHeading({ level: 3 }).run(),
                is_heading_4: editor.isActive('heading', { level: 4 }),
                can_heading_4: editor.can().chain().focus().toggleHeading({ level: 4 }).run(),
                is_bullet_list: editor.isActive('bulletList'),
                can_bullet_list: editor.can().chain().focus().toggleBulletList().run(),
                is_ordered_list: editor.isActive('orderedList'),
                can_ordered_list: editor.can().chain().focus().toggleOrderedList().run(),
                is_blockquote: editor.isActive('blockquote'),
                can_blockquote: editor.can().chain().focus().toggleBlockquote().run(),
                can_horizontal_rule: editor.can().chain().focus().setHorizontalRule().run(),
                is_code_block: editor.isActive('codeBlock'),
                can_code_block: editor.can().chain().focus().toggleCodeBlock().run(),
                is_table: editor.isActive('table'),
                can_insert_table: editor
                    .can()
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run(),
                can_add_column: editor.can().addColumnAfter(),
                can_add_row: editor.can().addRowAfter(),
            },
    });

    const isDisabled = disabled || !editor || !state;

    return (
        <div role='toolbar' aria-label='Toolbar editor' className='markdown-editor__toolbar'>
            <ToolbarGroup>
                <ToolbarButton
                    label='Bold'
                    active={state?.is_bold ?? false}
                    disabled={isDisabled || !state.can_bold}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                >
                    <IconBold />
                </ToolbarButton>
                <ToolbarButton
                    label='Italic'
                    active={state?.is_italic ?? false}
                    disabled={isDisabled || !state.can_italic}
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                >
                    <IconItalic />
                </ToolbarButton>
                <ToolbarButton
                    label='Underline'
                    active={state?.is_underline ?? false}
                    disabled={isDisabled || !state.can_underline}
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                >
                    <IconUnderline />
                </ToolbarButton>
                <ToolbarButton
                    label='Strikethrough'
                    active={state?.is_strike ?? false}
                    disabled={isDisabled || !state.can_strike}
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                >
                    <IconStrikethrough />
                </ToolbarButton>
                <ToolbarButton
                    label='Inline Code'
                    active={state?.is_code ?? false}
                    disabled={isDisabled || !state.can_code}
                    onClick={() => editor?.chain().focus().toggleCode().run()}
                >
                    <IconCode />
                </ToolbarButton>
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ToolbarButton
                    label='Paragraph'
                    active={!state?.is_heading}
                    disabled={isDisabled}
                    onClick={() => editor?.chain().focus().setParagraph().run()}
                >
                    <IconPilcrow />
                </ToolbarButton>
                <ToolbarButton
                    label='Heading 1'
                    active={state?.is_heading_1 ?? false}
                    disabled={isDisabled || !state.can_heading_1}
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <IconH1 />
                </ToolbarButton>
                <ToolbarButton
                    label='Heading 2'
                    active={state?.is_heading_2 ?? false}
                    disabled={isDisabled || !state.can_heading_2}
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <IconH2 />
                </ToolbarButton>
                <ToolbarButton
                    label='Heading 3'
                    active={state?.is_heading_3 ?? false}
                    disabled={isDisabled || !state.can_heading_3}
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <IconH3 />
                </ToolbarButton>
                <ToolbarButton
                    label='Heading 4'
                    active={state?.is_heading_4 ?? false}
                    disabled={isDisabled || !state.can_heading_4}
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
                >
                    <IconH4 />
                </ToolbarButton>
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ToolbarButton
                    label='Bullet List'
                    active={state?.is_bullet_list ?? false}
                    disabled={isDisabled || !state.can_bullet_list}
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                >
                    <IconList />
                </ToolbarButton>
                <ToolbarButton
                    label='Ordered List'
                    active={state?.is_ordered_list ?? false}
                    disabled={isDisabled || !state.can_ordered_list}
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                >
                    <IconListNumbers />
                </ToolbarButton>
                <ToolbarButton
                    label='Blockquote'
                    active={state?.is_blockquote ?? false}
                    disabled={isDisabled || !state.can_blockquote}
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                >
                    <IconBlockquote />
                </ToolbarButton>
                <ToolbarButton
                    label='Sisipkan garis pemisah'
                    disabled={isDisabled || !state.can_horizontal_rule}
                    onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                >
                    <IconMinus />
                </ToolbarButton>
                <ToolbarButton
                    label='Code Block'
                    active={state?.is_code_block ?? false}
                    disabled={isDisabled || !state.can_code_block}
                    onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                >
                    <IconSourceCode />
                </ToolbarButton>
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ToolbarButton
                    label='Sisipkan tabel'
                    disabled={isDisabled || !state.can_insert_table}
                    onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                >
                    <IconTablePlus />
                </ToolbarButton>
                {state?.is_table ? (
                    <>
                        <ToolbarButton
                            label='Tambah kolom'
                            disabled={isDisabled || !state.can_add_column}
                            onClick={() => editor?.chain().focus().addColumnAfter().run()}
                        >
                            <IconColumnInsertRight />
                        </ToolbarButton>
                        <ToolbarButton
                            label='Tambah baris'
                            disabled={isDisabled || !state.can_add_row}
                            onClick={() => editor?.chain().focus().addRowAfter().run()}
                        >
                            <IconRowInsertBottom />
                        </ToolbarButton>
                        <ToolbarButton
                            label='Hapus tabel'
                            disabled={isDisabled}
                            onClick={() => editor?.chain().focus().deleteTable().run()}
                        >
                            <IconTableMinus />
                        </ToolbarButton>
                    </>
                ) : null}
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <EditorEmbedPopover
                    title='Sisipkan gambar'
                    description='Masukkan URL gambar yang ingin ditampilkan di dalam editor.'
                    placeholder='https://example.com/image.png'
                    submitLabel='Sisipkan'
                    triggerLabel='Sisipkan gambar'
                    triggerIcon={<IconPhotoPlus />}
                    disabled={isDisabled}
                    validate={(value) => {
                        if (!value) return 'URL gambar wajib diisi.';
                        if (!isValidImageUrl(value)) return 'Gunakan URL gambar http/https yang valid.';
                    }}
                    onSubmit={(value) => editor?.chain().focus().setImage({ src: value, alt: 'Gambar sisipan' }).run()}
                />
                <EditorEmbedPopover
                    title='Sisipkan video YouTube'
                    description='Tempel URL video YouTube untuk membuat embed aman.'
                    placeholder='https://www.youtube.com/watch?v=...'
                    submitLabel='Sisipkan'
                    triggerLabel='Sisipkan video YouTube'
                    triggerIcon={<IconBrandYoutube />}
                    disabled={isDisabled}
                    validate={(value) => {
                        if (!value) return 'URL YouTube wajib diisi.';
                        if (!isValidYoutubeUrl(value)) return 'Gunakan URL YouTube yang valid.';
                        return undefined;
                    }}
                    onSubmit={(value) => {
                        if (!editor?.commands.setYoutubeVideo({ src: value })) {
                            return false;
                        }

                        return true;
                    }}
                />
                <EditorLinkPopover editor={editor} disabled={disabled} />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <EditorEmbedPopover
                    title='Sisipkan inline math'
                    description='Gunakan sintaks LaTeX, misalnya x^2 + y^2 = z^2.'
                    placeholder='x^2 + y^2 = z^2'
                    submitLabel='Sisipkan'
                    triggerLabel='Sisipkan inline math'
                    triggerIcon={<IconMath />}
                    disabled={isDisabled}
                    validate={(value) => (!value ? 'Formula wajib diisi.' : undefined)}
                    onSubmit={(value) => editor?.chain().focus().insertInlineMath({ latex: value }).run()}
                />
                <EditorEmbedPopover
                    title='Sisipkan block math'
                    description='Formula akan dirender sebagai block terpisah.'
                    placeholder='\\int_a^b x^2 dx'
                    submitLabel='Sisipkan'
                    triggerLabel='Sisipkan block math'
                    triggerIcon={<IconMathFunction />}
                    disabled={isDisabled}
                    validate={(value) => (!value ? 'Formula wajib diisi.' : undefined)}
                    onSubmit={(value) => editor?.chain().focus().insertBlockMath({ latex: value }).run()}
                />
            </ToolbarGroup>
        </div>
    );
}

export { MarkdownEditorToolbar };
