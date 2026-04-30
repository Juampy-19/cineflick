# Cineflick

Aplicación web para gestión de usuarios y catálogo de películas.

-----

## Tecnologías

- Next.js
- MySQL
- n8n (automatización)

-----

## Automatizaciónes con n8n

- Se implementó un workflow para enviar email de bienvenida automaticamente.

### Flujo

1. El usuario se registra
2. API guarda en DB
3. Se envía webhook a n8n
4. n8n envia el email

### Workflow

Ubicación: /n8n/workflows/Email de bienvenida.json

### Configuración

1. Importar en n8n
2. Configurar las credenciales Gmail
3. Activar el workflow

### Seguridad

Las credenciales no están incluidas.