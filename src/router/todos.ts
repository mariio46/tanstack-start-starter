import { os } from '@orpc/server';
import * as z from 'zod';

import { todoSchema } from '@/schemas/todo.schema';

const lists = [
    { id: 1, name: 'Get groceries' },
    { id: 2, name: 'Buy a new phone' },
    { id: 3, name: 'Finish the project' },
];

const index = os
    .input(z.object({}))
    .route({ method: 'GET', path: '/users' })
    .handler(() => {
        const todos = z.array(todoSchema).safeParse(lists);

        return todos;
    });

const store = os
    .input(z.object({ name: z.string() }))
    .route({ method: 'POST', path: '/users' })
    .handler(({ input }) => {
        const newTodo = { id: lists.length + 1, name: input.name };
        lists.push(newTodo);
        return newTodo;
    });

export const todoRouter = {
    index,
    store,
};
