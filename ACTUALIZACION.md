# Guía de Actualización: Curiol Studio 2026

Felicidades por tu nuevo sitio desplegado en **Vercel**. Aquí tienes los pasos clave para mantenerlo actualizado.

## 1. Proceso de Actualización de Código
Tu sitio está conectado directamente con tu repositorio de **GitHub**.

1. **Realizar Cambios**: Modifica los archivos en tu computadora usando tu editor (o pídeme ayuda para hacerlo).
2. **Enviar a GitHub**:
   - `git add .`
   - `git commit -m "Descripción de los cambios"`
   - `git push origin main`
3. **Despliegue Automático**: En cuanto hagas el `push`, Vercel detectará el cambio y reconstruirá el sitio automáticamente en **https://curiolstudio.vercel.app**.

## 2. Gestión de Variables de Entorno (API Keys)
Si necesitas cambiar las llaves de Firebase o Gemini:

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard).
2. Selecciona el proyecto **curiol**.
3. Ve a **Settings > Environment Variables**.
4. Edita o añade las variables (ej: `GEMINI_API_KEY`).
5. Realiza un nuevo despliegue (Redeploy) para que los cambios surtan efecto.

## 3. Cómo Cambiar la URL (de `curiol` a `curiolstudio`)
Si quieres que tu sitio sea **curiolstudio.vercel.app**:

1. Entra a tu proyecto en [Vercel](https://vercel.com/dashboard).
2. Ve a la pestaña **Settings > Domains**.
3. Verás la URL actual (`curiol.vercel.app`). Haz clic en el botón **Edit**.
4. Cambia `curiol` por `curiolstudio`.
5. Si el nombre está disponible, dale a **Save**. Vercel actualizará la URL automáticamente.

> [!TIP]
> **Dominio Propio**: Si compras un dominio como `curiolstudio.com`, en esa misma sección de **Domains** puedes añadirlo siguiendo las instrucciones de Vercel para configurar los DNS.

## 4. Estructura de Contenido
- **Blog**: Se edita en `src/app/comunidad/page.tsx`.
- **Precios/Paquetes**: Se editan en `src/app/cotizar/page.tsx`.
- **Servicios**: Se editan en `src/app/servicios/page.tsx`.

---
*Diseñado con el concepto Phygital por Curiol Studio & Antigravity.*
