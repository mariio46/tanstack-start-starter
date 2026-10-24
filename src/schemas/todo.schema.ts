import * as z from 'zod';

const todoSchema = z.object({
    id: z.number().int().min(1),
    name: z.string(),
});

export { todoSchema };
