import { z } from 'zod';

// Zod validation (Contrato de datos)
export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const userResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    createdAt: z.date().optional(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
