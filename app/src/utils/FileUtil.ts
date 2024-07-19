import FS, { WriteFileOptions } from 'fs';
import Path from 'path';

type BufferEncoding =
    | 'ascii'
    | 'utf8'
    | 'utf-8'
    | 'utf16le'
    | 'ucs2'
    | 'ucs-2'
    | 'base64'
    | 'base64url'
    | 'latin1'
    | 'binary'
    | 'hex';

type TypedArray =
    | Uint8Array
    | Uint8ClampedArray
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array
    | BigUint64Array
    | BigInt64Array
    | Float32Array
    | Float64Array;

type ArrayBufferView = TypedArray | DataView;

export default class FileUtil {
    static resolvePath(...paths: string[]) {
        return Path.normalize(Path.resolve(...paths.filter(Boolean)));
    }

    static existsPath(path: string) {
        return path != null && FS.existsSync(path);
    }

    static readFile(path: string, encoding?: BufferEncoding) {
        if (path && FileUtil.existsPath(path)) {
            return FS.readFileSync(path, { encoding });
        }

        return null;
    }

    static createReadStream(path: string, encoding?: BufferEncoding) {
        if (path && FileUtil.existsPath(path)) {
            return FS.createReadStream(path, { encoding });
        }

        return null;
    }

    static deleteFile(path: string) {
        if (path && FileUtil.existsPath(path) && FS.lstatSync(path).isFile()) {
            FS.unlinkSync(path);
        }
    }

    static writeFile(path: string, data: string | ArrayBufferView, options?: WriteFileOptions) {
        if (path) {
            FS.writeFileSync(path, data, options);
        }
    }
}
