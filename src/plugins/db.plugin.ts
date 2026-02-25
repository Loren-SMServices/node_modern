import fp from 'fastify-plugin';
// const { drizzle } = require('drizzle-orm/node-postgres');
// const { Client } = require('pg');

// En un entorno real se instalaría 'pg' y se inicializaría el cliente.
// export default fp(async (fastify, opts) => {
//   const client = new Client({ connectionString: process.env.DATABASE_URL });
//   await client.connect();
//   const db = drizzle(client);
//   fastify.decorate('db', db);
// });

import { FastifyInstance, FastifyPluginOptions } from 'fastify';

// Placeholder que muestra el uso de plugins encapsulados en Fastify
export default fp(async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
    fastify.decorate('dbInstance', 'Connected to Database via Fastify Encapsulation');
    console.log('[Plugin] DB Loaded');
});
