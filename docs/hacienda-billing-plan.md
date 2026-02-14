# Plan de Integración: Facturación Electrónica Hacienda CR (v4.4)

Resumen de requisitos técnicos y legales para la implementación del sistema de facturación electrónica en cumplimiento con la normativa del Ministerio de Hacienda de Costa Rica para 2024-2025.

## Requisitos Técnicos

### 1. Sistema de Comprobantes (Versión 4.4)
- **Obligatoriedad:** A partir del 1 de septiembre de 2025 (Transición inicia abril 2025).
- **Tipos de Documentos:**
    - Factura Electrónica (FE)
    - Tiquete Electrónico (TE)
    - Nota de Crédito (NC) / Nota de Débito (ND)
    - Recibo Electrónico de Pago (REP) - *Nuevo requisito para crédito*.

### 2. Credenciales Necesarias
Para realizar pruebas (Sandbox) y producción, se requiere:
- **Llave Criptográfica (.p12):** Archivo generado en ATV.
- **PIN de la Llave:** 4 dígitos.
- **Usuario API:** Generado en ATV (30 caracteres aprox).
- **Contraseña API:** Generada en ATV.

### 3. Flujo de Integración
1.  **Autenticación OAuth2:** Obtener token de acceso usando el usuario y contraseña de Hacienda (IDP).
2.  **Generación de XML:** Estructurar el XML según los esquemas de la versión 4.4.
3.  **Firma Digital:** Firmar el XML usando la llave .p12 y el estándar XAdES-EPES.
4.  **Envío (POST):** Enviar el XML firmado a la API de Hacienda.
5.  **Consulta de Estado (GET):** Consultar si el documento fue Aceptado o Rechazado.

## Elementos Clave V4.4
- **Código CABYS:** Obligatorio para cada línea de detalle.
- **Actividad Económica:** Se debe incluir el código de la actividad registrada en Hacienda.
- **SINPE Móvil:** Nuevos campos para identificar transacciones por este medio.

## Próximos Pasos (Martes)
- [ ] Definir la arquitectura de la base de datos para almacenar comprobantes.
- [ ] Crear el módulo de "Facturador" en la interfaz administrativa.
- [ ] Investigar librerías de Node.js para firma XAdES (ex. `xml-crypto` o `xadesjs`).
- [ ] Configurar variables de entorno para Sandbox.
