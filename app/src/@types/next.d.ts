import { NextApiRequest as Request } from 'next';

import { Readable } from 'stream';
import { UrlObject } from 'url';

import { Capability } from '@utils/Constant';

declare module 'next' {
    export type File = {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        stream: Readable;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
    };

    export interface NextApiRequest extends Request {
        params: { [key: string]: string };

        userId: string;
        capabilities: Capability[];
        can: (capabilities: Capability[]) => Promise<void>;

        file?: File;
        files?: File[];
    }
}

declare module 'next/router' {
    export interface TransitionOptions {
        shallow?: boolean;
        locale?: string | false;
        scroll?: boolean;
    }

    export declare type Url = UrlObject | string;
}
