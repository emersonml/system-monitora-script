import { Request } from 'express';

declare module 'express' {
  export interface ApiRequest extends Request {
    params: { [key: string]: string };

    userId: string;

    file?: File;
    files?: File[];
  }
}
