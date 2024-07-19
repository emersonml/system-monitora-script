import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { format, parseISO } from 'date-fns';
import requestIp from 'request-ip';
import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

export default class Util {
    static uuid(length?: number) {
        let uuid = uuidv4();

        if (length) {
            uuid = uuid.replace(/-/g, '').slice(0, length);
        }

        return uuid;
    }

    static delay(duration: number, callback?: () => void) {
        return new Promise<void>(resolve => {
            const timeout = setTimeout(() => {
                clearTimeout(timeout);

                if (callback) callback();
                resolve();
            }, duration);
        });
    }

    static toFixed(value: number, fractionDigits = 2) {
        return parseFloat(value.toFixed(fractionDigits));
    }

    static checkHash(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value || '', hash || '');
    }

    static async hash(value: string, salt = 8): Promise<string> {
        return bcrypt.hash(value, salt);
    }

    static randomString(length: number) {
        return crypto.randomBytes(length / 2).toString('hex');
    }

    static getValue(object: unknown, attrs: string | string[]) {
        attrs = Array.isArray(attrs) ? attrs : attrs.split('.');
        object = object[attrs[0]];

        if (object && attrs.length > 1) {
            return this.getValue(object, attrs.slice(1));
        }

        return object;
    }

    static clone(object: unknown) {
        return JSON.parse(JSON.stringify(object));
    }

    static slug(value: string) {
        return slugify(value, {
            lower: true
        });
    }

    static debounce = (func: any, delay: number) => {
        let debounceTimer: any;

        return (...args: any[]): void => {
            const later = () => {
                clearTimeout(debounceTimer);
                func(...args);
            };

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(later, delay);
        };
    };

    static imageUrlToBase64(url: string) {
        return new Promise<string>(async (resolve, reject) => {
            try {
                const blob = await fetch(url).then(response => response.blob());
                console.log('image-blob', blob);

                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            } catch (error) {
                reject(error);
            }
        });
    }

    static imageUrlToArrayBuffer(url: string) {
        return new Promise<ArrayBuffer>(async (resolve, reject) => {
            try {
                const arrayBuffer = await fetch(url).then(response => response.arrayBuffer());

                resolve(arrayBuffer);
            } catch (error) {
                reject(error);
            }
        });
    }

    static getExtName(path: string, removeDot = false) {
        if (!path) return null;

        if (path.includes('?')) {
            path = path.split('?')[0];
        }

        const match = path.match(/\.(?!.*\.).+$/i);
        if (match && match.length > 0) {
            let ext = match[0].toLowerCase();

            if (ext == '.gz' && /\.tar\.gz$/i.test(path)) {
                ext = '.tar.gz';
            }

            if (removeDot) {
                ext = ext.replace('.', '');
            }

            return ext;
        }

        return null;
    }

    static normalize(value: string | number) {
        return String(value)
            .toLowerCase()
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    static sanitizeHtml(value: string) {
        return sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {}
        });
    }

    static capitalizeFirstLetter(value: string) {
        return value.substr(0, 1).toUpperCase() + value.substr(1);
    }

    static bodyParser(body: Record<string, string>) {
        for (const [key, value] of Object.entries(body)) {
            if (/^[{[].*[\]}]$/s.test(value.trim())) {
                body[key] = JSON.parse(value);
            }
        }
    }

    static removeDuplicate<T, K = string>(list: T[], key: (item: T) => K) {
        const map = new Map<K, T>();
        for (const item of list.reverse()) {
            map.set(key(item), item);
        }
        return Array.from(map.values()).reverse();
    }

    static findUserIp(req) {
        let clientIp = requestIp.getClientIp(req);
        if (clientIp.substr(0, 7) == '::ffff:') {
            clientIp = clientIp.substr(7);
        }

        return clientIp;
    }

    static date(value: string | number | Date, mask: string) {
        if (!value) return '';

        if (typeof value == 'string') {
            value = parseISO(value);
        }

        return format(value, mask, {});
    }

    static getPhotoName(photoURL = ''): string {
        const regex = /\/([^/?]+)\?/;
        const match = photoURL?.match(regex);

        if (match) {
            return match[1];
        }
        return null;
    }

    static queryParser(query: Record<string | any, string | any | string[]>) {
        for (const [key, value] of Object.entries(query)) {
            if (!value) {
                delete query[key];
            }
        }

        return query;
    }

    static objectParser(object: Record<string | any, string | any | string[]>) {
        for (const [key, value] of Object.entries(object)) {
            if (!value) {
                delete object[key];
            }
        }

        return object;
    }

    static removeUnchangedFields(
        object: Record<string | any, string | any | string[]>,
        original: Record<string | any, string | any | string[]>
    ) {
        for (const [key, value] of Object.entries(object)) {
            if (original[key] == value) {
                delete object[key];
            }
        }

        return object;
    }
}
