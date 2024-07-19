import { InputHTMLAttributes } from 'react';

declare module 'react-input-mask' {
    export interface Props extends InputHTMLAttributes<HTMLInputElement> {
        maskChar?: string | null;
    }
}
