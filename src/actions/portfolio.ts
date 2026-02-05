"use server";

export interface PortfolioItem {
    categoria: string;
    subcategoria: string;
    url: string;
    titulo: string;
}

export async function getPortfolioData(): Promise<PortfolioItem[]> {
    const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR4OuEDRXmfwRB51PGyTyz2D9cxb5IwXnvDrSiHtzh37iGZY1to7EB0O1rPyKcVVcSHqeHFb1I4glNZ/pub?output=csv";

    try {
        const response = await fetch(CSV_URL, {
            next: { revalidate: 3600 } // Revalidar cada hora
        });

        if (!response.ok) {
            throw new Error("Error fetching portfolio data");
        }

        const csvText = await response.text();

        // Parser simple para el CSV
        const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
        const [_header, ...rows] = lines;

        const data: PortfolioItem[] = rows.map(row => {
            // Manejar comas dentro de comillas (títulos)
            const matches = row.match(/(".*?"|[^",\s][^",]*|(?<=,)(?=,)|(?<=^)(?=,))/g);
            if (!matches) return null;

            const [categoria, subcategoria, url, titulo] = matches.map(val =>
                val.replace(/^"|"$/g, "").trim()
            );

            return { categoria, subcategoria, url, titulo };
        }).filter(item => item !== null) as PortfolioItem[];

        return data;
    } catch (error) {
        console.error("Portfolio Fetch Error:", error);
        return [];
    }
}
