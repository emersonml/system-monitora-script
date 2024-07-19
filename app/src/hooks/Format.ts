import { format, formatDistanceToNowStrict, parseISO } from 'date-fns';
import en from 'date-fns/locale/en-US';
import pt from 'date-fns/locale/pt-BR';
import filesize from 'filesize';

import useTranslationState from '@states/TranslationState';

export type Format = {
    distanceToNow(value: Date): string;
    date(value: string | number | Date, mask: string): string;
    currency(value: number): string;
    number<T extends string | number>(value: number | string, options?: NumberOption): T;
    phone(phone: string): string;
    cep(value: string): string;
    cpfOrCnpj(value: string): string;
    filesize(value: number): string;
};

type NumberOption = {
    fractionDigits?: number;
    parseNumber?: boolean;
};

const locales = { pt, en };

export default function useFormat(): Format {
    const { language } = useTranslationState();

    return {
        distanceToNow(value: Date) {
            return formatDistanceToNowStrict(value, { locale: locales[language] });
        },
        date(value: string | number | Date, mask: string) {
            if (!value) return '';

            if (typeof value == 'string') {
                value = parseISO(value);
            }

            return format(value, mask, { locale: locales[language] });
        },
        currency(value: number) {
            value = value ?? 0;

            let locale = 'pt-BR';
            let currency = 'BRL';

            if (language == 'en') {
                locale = 'en-US';
                currency = 'USD';
            }

            return Intl.NumberFormat(locale, {
                style: 'currency',
                currency
            }).format(value);
        },
        number<T extends number | string>(value: number | string, options?: NumberOption): T {
            if (!options) options = { fractionDigits: 2, parseNumber: false };
            if (!options.fractionDigits) options.fractionDigits = 2;
            if (!options.parseNumber) options.parseNumber = false;

            const { fractionDigits, parseNumber } = options;

            value = parseFloat(String(value));
            if (Number.isNaN(value)) value = 0;

            value = value.toFixed(fractionDigits).replace(/\./g, ',');

            if (parseNumber) value = parseFloat(value);

            return value as T;
        },
        phone(phone: string) {
            if (!phone) return '';

            const cleaned = phone.replace(/\D/g, '');
            let match: RegExpMatchArray;

            match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
            if (match) {
                return `(${match[1]}) ${match[2]}-${match[3]}`;
            }

            match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
            if (match) {
                return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
            }

            return phone;
        },
        cep(value: string) {
            if (!value) return '';

            const cleaned = String(value).replace(/\D/g, '');

            const match = cleaned.match(/^(\d{5})(\d{3})$/);
            if (match) {
                return `${match[1]}-${match[2]}`;
            }

            return value;
        },
        cpfOrCnpj(value: string) {
            if (!value) return '';

            const cleaned = String(value).replace(/\D/g, '');
            let match: RegExpMatchArray;

            match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
            if (match) {
                return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
            }

            match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
            if (match) {
                return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
            }

            return value;
        },
        filesize(value: number) {
            return filesize(value, { locale: language });
        }
    };
}
