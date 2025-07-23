// src/types/html2pdf.d.ts
declare module 'html2pdf.js' {
    interface Html2PdfWorker {
        set: (options: {
            margin?: number;
            filename?: string;
            image?: { type: string; quality: number };
            html2canvas?: { scale: number };
            jsPDF?: { unit: string; format: string; orientation: string };
            pagebreak?: { mode: string | string[] };
        }) => Html2PdfWorker;
        from: (element: HTMLElement) => Html2PdfWorker;
        toPdf: () => Html2PdfWorker;
        output: (type: 'blob' | 'datauristring' | 'arraybuffer') => Promise<Blob>;
        save: () => Promise<void>;
    }

    const html2pdf: {
        (): Html2PdfWorker;
    };
    export default html2pdf;
}
