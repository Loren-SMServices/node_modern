import fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import dbPlugin from './plugins/db.plugin';
import userRoutes from './routes/user.routes';

// Framework Fastify - Rápido y sin middleware en cascada innecesario
const app = fastify({
    logger: true,
    ajv: {
        customOptions: {
            removeAdditional: 'all', // Remueve data irrelevante no declarada (Aceleración de serialización)
            coerceTypes: false,
            useDefaults: true
        }
    }
});

// Registrando Swagger para Interfaz Visual de la API
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Modern Node API',
            description: 'Documentación visual autogenerada del stack Node Moderno',
            version: '1.0.0'
        },
        servers: [{ url: 'http://localhost:3000' }]
    }
});

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    }
});

// Registrando capa de infraestructura (Plugins)
app.register(dbPlugin);

// Registrando endpoints en su contexto protegido
// Con un prefijo /api, los middlewares que pongamos en userRoutes solo afectan a ese prefijo.
app.register(userRoutes, { prefix: '/api' });

// Health check para serverless y testing
app.get('/health', async () => ({ status: 'ok' }));

// Inicio
const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
        console.log(`🚀 Server listening at http://localhost:3000`);
        console.log(`📚 Interfaz de API (Swagger) disponible en http://localhost:3000/docs`);
        console.log(`⚡ Ejecutalo con Bun para arranques < 1ms: bun run src/index.ts`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
