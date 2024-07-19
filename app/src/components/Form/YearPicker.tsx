import generatePicker from 'antd/lib/date-picker/generatePicker';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import { SharedTimeProps } from 'rc-picker/lib/panels/TimePanel';

import { useAntdConfig } from '@locales/antd/AntdConfigRoot';

const DatePickerCustom = generatePicker<Date>(dateFnsGenerateConfig);

type Props = SharedTimeProps<Date> & {
    disabled?: boolean;
    value?: Date | null;
    mode: 'month' | 'year';
    picker: 'month' | 'year';
    onChange?: (value: Date) => void;
};

export default function YearPicker(props: Props) {
    const { locale } = useAntdConfig();

    const handleDateChange = (date: Date | null) => {
        if (date) {
            date.setHours(0, 0, 0, 0);
        }

        if (props?.onChange) {
            props.onChange(date);
        }
    };

    return <DatePickerCustom onChange={handleDateChange} locale={locale.DatePicker} {...props} />;
}
