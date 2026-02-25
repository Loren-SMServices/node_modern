# Usa la imagen oficial de Bun (basada en Alpine para menor peso o la standard)
FROM oven/bun:latest

# Crea y define el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de manifiesto para la instalación de dependencias
COPY package.json bun.lock* ./

# Instala dependencias para producción (solo las necesarias)
RUN bun install --frozen-lockfile

# Copia el código fuente (respetando las exclusiones del .dockerignore)
COPY . .

# Expone el puerto configurado en nuestro index.ts
EXPOSE 3000

# Define el usuario a nivel 'bun' por seguridad estándar en producción (evitar root)
USER bun

# Comando de inicio del proyecto a la velocidad del rayo
CMD ["bun", "run", "start"]
