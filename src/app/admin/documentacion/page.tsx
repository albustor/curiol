"use client";

import React from 'react';
import { ProcessDocumentation, DocSection, DocStep, DocAlert } from '@/components/admin/ProcessDocumentation';
import { useRole } from '@/hooks/useRole';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CommandK } from '@/components/admin/CommandK';

export default function DocumentacionMaestra() {
    const { role, isMaster } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (role !== "LOADING" && !isMaster) {
            router.push('/admin/dashboard');
        }
    }, [isMaster, role, router]);

    if (role === "LOADING" || !isMaster) return null;

    return (
        <div className="relative">
            <div className="fixed top-8 right-8 z-[100] flex items-center gap-4">
                <CommandK isMaster={isMaster} />
            </div>
            <ProcessDocumentation
                title="Guía Maestra: Configuración Meta WhatsApp Business"
                lastUpdated="12 de Febrero, 2026"
                content={
                    <>
                        <p className="leading-relaxed mb-8">
                            Esta guía documenta el proceso estandarizado para configurar la API de WhatsApp de Meta para clientes,
                            asegurando la preservación del historial conversacional, la identidad de marca y la escalabilidad técnica.
                        </p>

                        <DocSection title="1. Estrategia de Marca y Portfolio">
                            <p className="mb-4">
                                Cuando un cliente cambia de nombre comercial (ej. "Alberto Bustos" → "Curiol Studio"),
                                la regla de oro es <strong>no crear un negocio nuevo desde cero</strong>.
                            </p>
                            <DocStep
                                number="1.1"
                                text="Mantener el histórico de activos"
                                subtext="Identifica el Portfolio comercial que ya posee las páginas y cuentas verificadas."
                            />
                            <DocStep
                                number="1.2"
                                text="Transición de nombre suave"
                                subtext="Renombra el Portfolio desde el panel de 'Información del negocio'. Esto preserva logs y el 'Quality Rating' del número."
                            />
                            <DocAlert type="tip">
                                Este procedimiento ahorra semanas de espera en procesos de verificación por parte de Meta.
                            </DocAlert>
                        </DocSection>

                        <DocSection title="2. Configuración Técnica (Paso a Paso)">
                            <DocStep
                                number="2.1"
                                text="Usuarios del Sistema (El Motor del API)"
                                subtext="Dentro de 'Configuración del Negocio' > 'Usuarios del sistema'. Crea un usuario 'IA-Assistant' con rol de Administrador."
                            />
                            <DocStep
                                number="2.2"
                                text="Asignación de Activos Críticos"
                                subtext="Asigna explícitamente la App del proyecto y la Cuenta de WhatsApp al usuario creado, activando el 'Control Total'."
                            />
                            <DocStep
                                number="2.3"
                                text="Generación del Token Permanente"
                                subtext="Genera el token seleccionando los permisos 'whatsapp_business_messaging' y 'whatsapp_business_management'. Este token no caduca (permanente)."
                            />
                        </DocSection>

                        <DocSection title="3. Webhooks y Handshake de Datos">
                            <p className="mb-4">Para que la IA reciba mensajes en tiempo real, el Webhook debe estar configurado y suscrito:</p>
                            <DocStep
                                number="3.1"
                                text="Configurar URL de Devolución"
                                subtext="Apunta a https://[tu-dominio].com/api/webhooks/meta"
                            />
                            <DocStep
                                number="3.2"
                                text="Suscripción de Campos"
                                subtext="Es imperativo suscribir el campo 'messages'. Sin esto, la IA será 'sorda' a los mensajes entrantes."
                            />
                        </DocSection>

                        <DocAlert type="warning">
                            Asegúrate de que la Autenticación de Dos Pasos (2FA) esté activa en la cuenta personal del administrador,
                            de lo contrario, los botones de creación estarán deshabilitados por seguridad de Meta.
                        </DocAlert>

                        <div className="mt-12 text-zinc-400 text-sm italic border-t pt-4">
                            * Documento de uso exclusivo para consultoría estratégica de Curiol Studio.
                        </div>
                    </>
                }
            />
        </div>
    );
}
