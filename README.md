# 🎬 Cineflick

Aplicación web para gestión de usuarios y catálogo de películas.

---

## 🚀 Tecnologías

- Next.js
- MySQL
- n8n (automatización)
- Gmail API

---

## 🔄 Automatización con n8n

Se implementó un workflow para enviar emails de bienvenida automáticamente.

### 🔧 Flujo

1. Usuario se registra
2. API guarda en DB
3. Se envía webhook a n8n
4. n8n envía email

### 📦 Workflow

Ubicación:

/n8n/workflows/Email de bienvenida.json

### ⚙️ Configuración

1. Importar en n8n
2. Configurar credenciales Gmail
3. Activar workflow

### 🔐 Seguridad

Las credenciales no están incluidas.

---

## 🔄 Automatización con n8n

Se implementó un workflow para enviar emails con el detalle de la compra automáticamente.

### 🔧 Flujo

1. Usuario realiza la compra
2. API guarda la compra en DB
3. Se envía webhook a n8n
4. n8n envía email

### 📦 Workflow

/n8n/workflows/Confirmación de compra.json

### ⚙️ Configuración

1. Importar en n8n
2. Configurar credenciales Gmail
3. Activar workflow

### 🔐 Seguridad

Las credenciales no están incluidas.