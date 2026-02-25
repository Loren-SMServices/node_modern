# Modern Node Stack Project

## Tecnologías ("The Modern Node Stack")

- **Framework**: [Fastify](https://fastify.dev/) - Hasta 5 veces más rápido que Express. Usa un sistema de plugins que evita cargar código innecesario.
- **Validación**: [Zod](https://zod.dev/) - Validación de datos instantánea que genera tipos de TypeScript de forma automática.
- **Base de Datos**: [Drizzle ORM](https://orm.drizzle.team/) - Básicamente un TypeScript ligado estrechamente a SQL puro y sin el alto costo de un runtime pesado.
- **Documentación API**: Swagger UI integrado directamente gracias a la combinación de esquemas Zod con `@fastify/swagger` y v5 de Fastify.
- **Workers / Event-Driven**: Se integra en dependencias [BullMQ](https://docs.bullmq.io/) y Redis en el package.json listo para separar tareas del hilo principal (Event Loop), manteniendo el tiempo libre.

## Reglas Pro Implementadas

1. **Arquitectura No Bloqueante ("Event-Driven"):** Nunca bloqueamos el Event Loop. Operaciones de alto CPU se delegan usando `Worker Threads` o colas de mensajes (BullMQ).
2. **Serialización Ultrarrápida:** Prevenimos cuellos de botella del `JSON.stringify`. Utilizamos las capacidades de *ajv* (vía Fastify schemas) pasando nuestros Zod objectos con `zodToJsonSchema` para compilar los JSON de la API en tiempo récord (+200% aceleración).
3. **Sistema sin Middleware en Cascada:** En Express todo middleware corre en cada ruta. Aquí nos basamos en el sistema de *encapsulación* de Fastify usando decoradores aislados para no penalizar el rendimiento del servidor.

## Estructura del Proyecto

```plaintext
/src
  /routes          # Definiciones de endpoints (Hitos de baja latencia Fastify)
  /services        # Lógica de negocio pura (Independiente del framework o motor Web)
  /db              # Esquemas de Drizzle ORM y contexto de base de datos
  /plugins         # Infraestructura (Capa base para conexiones, plugins Fastify, etc)
  /schemas         # Contratos de datos estrictos (Validaciones Zod de in/out)
```

## Ejecución Local

Este proyecto ha sido migrado para ejecutarse nativamente con **Bun**, lo que garantiza arranques en milisegundos y un menor consumo de memoria.

Para instalar las dependencias (si no lo has hecho aún):
```bash
bun install
```

Para iniciar el servidor en modo desarrollo (con hot-reloading de Bun):
```bash
bun run dev
```

El flag `--hot` de Bun recompila y reinicia instantáneamente los cambios en TypeScript sin necesidad de reinicios pesados o watchers como `nodemon` o `tsx`. Y al tratar nativamente el TypeScript, nos evitamos los pesados pasos de transpilación y comandos de Build (como `tsc`).

## Endpoints Disponibles y Documentación (Swagger)

Con la última actualización, hemos migrado a **Fastify v5** para garantizar compatibilidad con los paquetes visuales más recientes de la comunidad. 

Gracias a la integración de `@fastify/swagger` y la forma en que pasamos las validaciones de Zod al framework, podemos disfrutar de una **interfaz visual Swagger 100% autogenerada**.

🔗 Para abrir la interfaz visual, inicia el servidor de desarrollo y navega a:
**[http://localhost:3000/docs](http://localhost:3000/docs)**

### Endpoints principales registrados en Swagger:
- **`GET /health`**: Healthcheck (Asegura que el server está vivo).
- **`GET /api/users`**: Obtiene el listado de usuarios (Validado por el Data Contract de Zod).
- **`POST /api/users`**: Crear un nuevo usuario (Swagger UI validará internamente el Name y Email gracias a la configuración de Zod antes de enviarlo).

## Despliegue con Docker

Esta infraestructura está construida pensando en producción utilizando microservicios dockerizados, apoyándose en la imagen ultraligera oficial de Bun. A continuación, el detalle de los archivos relacionados:

### 1. El Dockerfile y `.dockerignore`
El proyecto contiene un `Dockerfile` optimizado que utiliza la imagen `oven/bun:latest`. 
- Se copian primero los archivos `package.json` y `bun.lock*` para aprovechar la caché de Docker.
- Se hace un build con `--frozen-lockfile` y se ejecuta directamente desde TypeScript `CMD ["bun", "run", "start"]` ahorrando procesos extra de compilación pesada.
- `.dockerignore` previene la copia de tus `node_modules` locales hacia el contenedor salvando tiempos de transferencia valiosos.

### 2. Contenedores Unificados (`docker-compose.yml`)
Hemos centralizado el entorno de trabajo con `docker-compose.yml`, el cual integra tres servicios autoconectados y montados con volúmenes locales de persistencia:

1. **API (Bun)**: Tu backend sirviendo la app TypeScript en el puerto 3000.
2. **PostgreSQL**: Base de datos SQL relacional (`postgres:15-alpine`) lista para usar el motor estricto de Drizzle ORM expuesta en el puerto 5432.
3. **Redis**: Cache o Broker para tareas y trabajos en colas usando BullMQ (`redis:7-alpine`) en el puerto 6379.
4. **PGWeb**: Interfaz gráfica superligera (`sosedoff/pgweb`) pre-conectada a tu Postgres para visualizar datos en el puerto 8081.

### 3. Levantar y Controlar el Ecosistema Completo
Con Docker instalado, tan solo asegúrate de estar en la raíz de la carpeta base y usa estos sencillos comandos:

- **Efectuar el arranque del entorno global en 2do plano (Recomendado):**
  ```bash
  docker-compose up -d
  ```
  *(Una vez ejecutado, tendrás Swagger en tu puesto 3000 `/docs` y el gestor de base de datos PGWeb en [http://localhost:8081](http://localhost:8081))*

- **Reconstruir la imagen de la API sin caché tras modificar tus dependencias u archivos base:**
  ```bash
  docker-compose up -d --build
  ```

- **Bajar y apagar el entorno limpiamente sin perder volúmenes (los datos de tu base o cache permanecerán listos para la próxima):**
  ```bash
  docker-compose down
  ```

Si por alguna razón falla el compilado (al no encontrarse la caché del manifest de bun), asegurate de haber corrido `bun install` a nivel local para que se genere primeramente el archivo de bloqueos `bun.lockb` o tu generador local equivalente.
