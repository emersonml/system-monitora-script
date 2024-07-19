import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

type PDFData = {
    content: string;
    numPages: number;
};

export default class PDF {
    static download(config: TDocumentDefinitions) {
        pdfMake.createPdf(config).download();
    }

    static createUrl(config: TDocumentDefinitions) {
        return new Promise<string>((resolve, reject) => {
            try {
                const doc = pdfMake.createPdf(config);
                doc.getBlob(blob => resolve(URL.createObjectURL(blob)));
            } catch (error) {
                reject(error);
            }
        });
    }

    static async read(path: string): Promise<PDFData> {
        try {
            const doc = await pdfjs.getDocument(path).promise;
            const content: Promise<string[]>[] = [];

            for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
                content.push(
                    new Promise<string[]>(async resolve => {
                        const page = await doc.getPage(pageNumber);
                        const { items } = await page.getTextContent();
                        resolve(items.map((item: TextItem) => item.str.replace(/\s{2,}/g, ' ')).filter(Boolean));
                    })
                );
            }

            return {
                content: (await Promise.all(content)).flat().join('\n'),
                numPages: doc.numPages
            };
        } catch (error) {
            return null;
        }
    }
}
