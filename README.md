# Alberto Bustos Fotografía - Curiol Studio 2026

Este proyecto ha sido refactorizado a una arquitectura **Vanilla HTML5, JavaScript y CSS (Tailwind via CDN)** para maximizar la velocidad, simplicidad y facilidad de mantenimiento.

## Estructura del Proyecto

- `index.html`: Punto de entrada principal. Es una aplicación de una sola página (SPA) que maneja todas las secciones: Inicio, Servicios, Cotizador, Soluciones Web y Comunidad.
- `realidadaumentada.html`: Experiencia de Realidad Aumentada (AR) independiente utilizando MindAR y A-Frame.
- `servicios.html` & `cotizador.html`: Versiones heredadas por compatibilidad (redireccionan internamente).
- `legacy/`: Directorio que contiene el respaldo de la versión anterior de Next.js y otros archivos históricos.

## Tecnologías Utilizadas

- **Frontend**: Vanilla JS (ES Modules), HTML5, CSS3.
- **Estilos**: Tailwind CSS (CDN).
- **Iconos**: Lucide Icons.
- **Backend/Base de Datos**: Firebase Modular SDK (v10+).
- **Exportación**: jsPDF & html2canvas para la generación de propuestas en PDF.
- **AR**: MindAR & A-Frame para experiencias inmersivas.

## Cómo Ejecutar

Simplemente abre el archivo `index.html` en cualquier navegador moderno. Para funcionalidades de Firebase (si se configuran), se recomienda usar un servidor local:

```bash
npx serve
```

## Configuración de Firebase

Edita las constantes `firebaseConfig` en la sección de scripts de `index.html` con tus credenciales de proyecto.

---
© 2026 Curiol Studio • Alberto Bustos Fotografía
