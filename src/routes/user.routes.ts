import { FastifyPluginAsync } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { createUserSchema, userResponseSchema } from '../schemas/user.schema';
import { userService } from '../services/user.service';

const userRoutes: FastifyPluginAsync = async (fastify, opts) => {
    // Crear Usuario - Endpoint de baja latencia
    fastify.post('/users', {
        schema: {
            body: zodToJsonSchema(createUserSchema as any, { target: 'jsonSchema7' }),
            response: {
                201: zodToJsonSchema(userResponseSchema as any, { target: 'jsonSchema7' })
            }
        }
    }, async (request, reply) => {
        // La validación ya fue hecha por ajv internamente gracias al esquema Fastify
        const input = createUserSchema.parse(request.body);
        const user = await userService.createUser(input);
        return reply.status(201).send(user);
    });

    // Obtener Todos
    fastify.get('/users', {
        schema: {
            response: {
                200: {
                    type: 'array',
                    items: zodToJsonSchema(userResponseSchema as any, { target: 'jsonSchema7' })
                }
            }
        }
    }, async (request, reply) => {
        const users = await userService.getAllUsers();
        return reply.status(200).send(users);
    });
};

export default userRoutes;
