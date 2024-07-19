export * from 'antd';

declare module 'antd' {
    type InternalNamePath = (string | number)[];

    export interface ValidateErrorEntity<Values = unknown> {
        values: Values;
        errorFields: {
            name: InternalNamePath;
            errors: string[];
        }[];
        outOfDate: boolean;
    }
}
