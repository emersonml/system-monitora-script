import generatePicker from 'antd/lib/date-picker/generatePicker';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';

import { useAntdConfig } from '@locales/antd/AntdConfigRoot';
import useTranslationState from '@states/TranslationState';

const DatePickerCustom = generatePicker<Date>(dateFnsGenerateConfig);

type Props = {
    showTime?: boolean;
    disabled?: boolean;
    value?: Date | null;
    onChange?: (value: Date) => void;
};

export default function DatePicker({ onChange, showTime = false, ...props }: Props) {
    const { language } = useTranslationState();
    const { locale } = useAntdConfig();

    let format = 'dd/MM/yyyy';
    if (language == 'en') {
        format = 'yyyy/MM/dd';
    }

    if (showTime) {
        format += ' HH:mm';
    }

    const handleDateChange = (date: Date | null) => {
        if (date && !showTime) {
            date.setHours(0, 0, 0, 0);
        }

        if (onChange) {
            onChange(date);
        }
    };

    return (
        <DatePickerCustom
            onChange={handleDateChange}
            locale={locale.DatePicker}
            format={format}
            showTime={showTime}
            {...props}
        />
    );
}
