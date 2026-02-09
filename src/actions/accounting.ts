"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { FINANCE_CONFIG } from "@/lib/finance-constants";

export interface Transaction {
    id?: string;
    date: Date | Timestamp;
    type: 'income' | 'expense';
    category: 'photography' | 'software' | 'production' | 'collaborator' | 'fixed_cost' | 'other';
    amount: number;
    iva: number;
    net: number;
    description: string;
    receiptUrl?: string;
    ciiu?: string;
    status: 'pending' | 'recorded';
    relatedId?: string;
}

export async function recordTaxTransaction(data: Partial<Transaction>) {
    try {
        const net = data.net || (data.amount ? data.amount / (1 + FINANCE_CONFIG.TAX.IVA_RATE) : 0);
        const iva = data.iva || (data.amount ? data.amount - net : 0);
        const amount = data.amount || net + iva;

        const transactionData = {
            date: Timestamp.now(),
            type: data.type || 'expense',
            category: data.category || 'other',
            amount,
            iva,
            net,
            description: data.description || "",
            receiptUrl: data.receiptUrl || "",
            ciiu: data.ciiu || (data.category === 'photography' ? FINANCE_CONFIG.TAX.CODES.PHOTOGRAPHY : FINANCE_CONFIG.TAX.CODES.SOFTWARE),
            status: 'recorded',
            relatedId: data.relatedId || null,
        };

        const docRef = await addDoc(collection(db, "accounting"), transactionData);

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error recording transaction:", error);
        return { success: false, error: "Failed to record transaction" };
    }
}

export async function generateHaciendaReport(month: number, year: number) {
    try {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const q = query(
            collection(db, "accounting"),
            where("date", ">=", Timestamp.fromDate(start)),
            where("date", "<=", Timestamp.fromDate(end))
        );

        const snapshot = await getDocs(q);
        const transactions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

        const report = {
            period: `${month}/${year}`,
            income: {
                net: transactions.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + t.net, 0),
                iva: transactions.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + t.iva, 0),
                total: transactions.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + t.amount, 0),
            },
            expenses: {
                net: transactions.filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + t.net, 0),
                iva: transactions.filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + t.iva, 0),
                total: transactions.filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + t.amount, 0),
            },
            taxToPay: 0,
            transactionCount: transactions.length
        };

        report.taxToPay = report.income.iva - report.expenses.iva;

        return { success: true, report };
    } catch (error) {
        console.error("Error generating report:", error);
        return { success: false, error: "Failed to generate report" };
    }
}

export async function analyzeTaxDeduction(queryText: string) {
    const lowerQuery = queryText.toLowerCase();

    if (lowerQuery.includes("camara") || lowerQuery.includes("equipo") || lowerQuery.includes("lente")) {
        return "El equipo fotográfico es deducible al 100% bajo el código 7420, sujeto a la tabla de depreciación anual (D-101).";
    }

    if (lowerQuery.includes("software") || lowerQuery.includes("licencia") || lowerQuery.includes("gemini")) {
        return "Las suscripciones de software son gastos operativos deducibles. Asegúrate de que la factura esté a nombre de Curiol Studio.";
    }

    if (lowerQuery.includes("hacienda") || lowerQuery.includes("pago") || lowerQuery.includes("fecha")) {
        return "Recuerda que el IVA (D-104) se paga los primeros 15 días de cada mes. La renta (D-101) es un pago anual.";
    }

    return "Como tu Consultor IA, te recomiendo registrar este gasto con su respectiva factura electrónica para validarlo en tu declaración mensual.";
}
