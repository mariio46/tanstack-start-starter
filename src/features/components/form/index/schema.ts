import * as z from 'zod';

import { validateFiles } from '@/lib/file';

import { defaultRichTextPayload, richTextSchema } from '@/schemas/rich-text.schema';

import { ATTACHMENT_CONSTRAINTS, LEAVE_DATES_MAX, RICH_TEXT_CONSTRAINTS } from './constants';

const textFieldsSchema = z.object({
    name: z.string().trim().min(1, 'Nama wajib diisi.'),
    password: z.string().min(8, 'Password minimal 8 karakter.'),
    salary: z
        .number({ error: 'Gaji wajib diisi.' })
        .min(1_000_000, 'Gaji minimal Rp 1.000.000.')
        .optional()
        .refine((value) => value !== undefined, 'Gaji wajib diisi.'),
    username: z
        .string()
        .min(3, 'Username minimal 3 karakter.')
        .regex(/^[a-z0-9_]+$/, 'Hanya huruf kecil, angka, dan underscore.'),
    bio: z.string().max(200, 'Bio maksimal 200 karakter.'),
});

type TextFieldsPayload = z.input<typeof textFieldsSchema>;

const textFieldsDefaultValues: TextFieldsPayload = {
    name: '',
    password: '',
    salary: undefined,
    username: '',
    bio: '',
};

const choiceFieldsSchema = z.object({
    division: z.string().min(1, 'Pilih divisi.'),
    manager: z.string().min(1, 'Pilih atasan.'),
    skills: z.array(z.string()).min(2, 'Pilih minimal dua skill.'),
    agreement: z.boolean().refine((value) => value, 'Centang untuk melanjutkan.'),
    notifications: z.array(z.string()).min(1, 'Pilih minimal satu kanal.'),
    permissions: z.array(z.string()).min(1, 'Pilih minimal satu permission.'),
    employment_type: z.string().min(1, 'Pilih tipe karyawan.'),
});

type ChoiceFieldsPayload = z.input<typeof choiceFieldsSchema>;

const choiceFieldsDefaultValues: ChoiceFieldsPayload = {
    division: '',
    manager: '',
    skills: [],
    agreement: false,
    notifications: [],
    permissions: [],
    employment_type: '',
};

const dateFieldsSchema = z.object({
    birth_date: z.string().min(1, 'Tanggal lahir wajib diisi.'),
    scheduled_at: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Isi tanggal dan jam.'),
    leave_dates: z
        .array(z.string())
        .min(1, 'Pilih minimal satu tanggal.')
        .max(LEAVE_DATES_MAX, `Maksimal ${LEAVE_DATES_MAX} tanggal.`),
});

type DateFieldsPayload = z.input<typeof dateFieldsSchema>;

const dateFieldsDefaultValues: DateFieldsPayload = {
    birth_date: '',
    scheduled_at: '',
    leave_dates: [],
};

const fileFieldsSchema = z.object({
    attachments: z.array(z.instanceof(File)).superRefine((files, ctx) => {
        const message = validateFiles(files, ATTACHMENT_CONSTRAINTS);

        if (message) ctx.addIssue({ code: 'custom', message });
    }),
    photo: z.array(z.instanceof(File)).min(1, 'Unggah satu foto.'),
});

type FileFieldsPayload = z.input<typeof fileFieldsSchema>;

const fileFieldsDefaultValues: FileFieldsPayload = {
    attachments: [],
    photo: [],
};

const richTextFieldSchema = z.object({
    content: richTextSchema(RICH_TEXT_CONSTRAINTS),
});

type RichTextFieldPayload = z.input<typeof richTextFieldSchema>;

const richTextFieldDefaultValues: RichTextFieldPayload = {
    content: defaultRichTextPayload,
};

const validationSchema = z.object({
    name: z.string().trim().min(1, 'Nama wajib diisi.'),
    email: z.email('Format email tidak valid.'),
});

type ValidationPayload = z.input<typeof validationSchema>;

const validationDefaultValues: ValidationPayload = {
    name: '',
    email: '',
};

const addressSchema = z.object({
    street: z.string().trim().min(1, 'Alamat wajib diisi.'),
    city: z.string().trim().min(1, 'Kota wajib diisi.'),
    postal_code: z.string().regex(/^\d{5}$/, 'Kode pos harus 5 digit.'),
});

type AddressPayload = z.input<typeof addressSchema>;

const addressDefaultValues: AddressPayload = {
    street: '',
    city: '',
    postal_code: '',
};

const compositionSchema = z.object({
    company: z.string().trim().min(1, 'Nama perusahaan wajib diisi.'),
    billing: addressSchema,
    shipping: addressSchema,
});

type CompositionPayload = z.input<typeof compositionSchema>;

const compositionDefaultValues: CompositionPayload = {
    company: '',
    billing: addressDefaultValues,
    shipping: addressDefaultValues,
};

const blockerSchema = z.object({
    title: z.string().trim().min(1, 'Judul wajib diisi.'),
    note: z.string().trim().min(1, 'Catatan wajib diisi.'),
});

type BlockerPayload = z.input<typeof blockerSchema>;

const blockerDefaultValues: BlockerPayload = {
    title: '',
    note: '',
};

export type {
    AddressPayload,
    BlockerPayload,
    ChoiceFieldsPayload,
    CompositionPayload,
    DateFieldsPayload,
    FileFieldsPayload,
    RichTextFieldPayload,
    TextFieldsPayload,
    ValidationPayload,
};
export {
    addressDefaultValues,
    blockerDefaultValues,
    blockerSchema,
    choiceFieldsDefaultValues,
    choiceFieldsSchema,
    compositionDefaultValues,
    compositionSchema,
    dateFieldsDefaultValues,
    dateFieldsSchema,
    fileFieldsDefaultValues,
    fileFieldsSchema,
    richTextFieldDefaultValues,
    richTextFieldSchema,
    textFieldsDefaultValues,
    textFieldsSchema,
    validationDefaultValues,
    validationSchema,
};
