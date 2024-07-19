import XLSX from 'xlsx';

import FileUtil from '@utils/FileUtil';

type Sheet = {
    name: string;
    values: Value[];
};

type Value = {
    [key: string]: string | number;
};

export default class Exel {
    static read(path: string) {
        try {
            const xlsx = XLSX.read(FileUtil.readFile(path), { type: 'buffer' });
            const sheets: Sheet[] = [];

            for (const name of xlsx.SheetNames) {
                const sheet = xlsx.Sheets[name];
                const values = XLSX.utils.sheet_to_json<Value>(sheet, { range: sheet['!ref'] });

                sheets.push({ name, values });
            }

            return sheets;
        } catch (error) {
            return null;
        }
    }
}
