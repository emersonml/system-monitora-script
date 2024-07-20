import bcrypt from 'bcryptjs';

export default class Util {
  static checkHash(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value || '', hash || '');
  }

  static async hash(value: string, salt = 8): Promise<string> {
    return bcrypt.hash(value, salt);
  }

  static removeDuplicate<T, K = string>(list: T[], key: (item: T) => K) {
    const map = new Map<K, T>();
    for (const item of list.reverse()) {
      map.set(key(item), item);
    }
    return Array.from(map.values()).reverse();
  }
}
