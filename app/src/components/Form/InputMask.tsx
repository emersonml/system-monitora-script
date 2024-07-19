import React from 'react';

import { Input, InputProps } from 'antd';
import ReactInputMask from 'react-input-mask';

type Props = InputProps & {
    mask: string | Array<string | RegExp>;
    maskChar?: string | null;
};

export default function InputMask({ mask, maskChar = '', value, disabled, onChange, onBlur, ...rest }: Props) {
    return (
        <ReactInputMask
            value={value}
            mask={mask}
            maskChar={maskChar}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}>
            {() => <Input {...rest} disabled={disabled} />}
        </ReactInputMask>
    );
}
