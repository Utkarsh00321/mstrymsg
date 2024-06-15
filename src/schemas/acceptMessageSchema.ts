import {z} from 'zod';

export const acceptMessageSchema = z.object({
accepting:z.boolean(),
});
