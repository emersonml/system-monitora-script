export default class Storage {
    static set<T>(key: string, value: T) {
        localStorage.setItem(`i9-erp:${key}`, JSON.stringify(value));
    }

    static get<T>(key: string, defaultValue: T): T {
        const value = localStorage.getItem(`i9-erp:${key}`);

        if (value != null) {
            return JSON.parse(value);
        }

        return defaultValue;
    }

    static remove(key: string) {
        localStorage.removeItem(`i9-erp:${key}`);
    }
}
