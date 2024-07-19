import { DatePicker, Form } from 'antd';
import styled from 'styled-components';

import { useAntdConfig } from '@locales/antd/AntdConfigRoot';
import useTranslationState from '@states/TranslationState';

type FieldPicker = {
    name: string;
};

type DateRangerPickerProps = {
    fields: FieldPicker[];
    title: string;
    onlyYear?: boolean;
};
export const DateRangePicker = ({ fields, title, onlyYear }: DateRangerPickerProps) => {
    const { translation } = useTranslationState();
    const { language } = useTranslationState();

    const { locale } = useAntdConfig();

    let format = 'DD/MM/yyyy';
    if (language == 'en') {
        format = 'yyyy/MM/dd';
    }
    return (
        <Container>
            <Content>
                <span>{translation(title)}</span>
                {onlyYear ? (
                    <DateContent>
                        {fields.map(field => (
                            <Form.Item name={field.name}>
                                <DatePicker
                                    locale={locale.DatePicker}
                                    picker="year"
                                    style={{ minWidth: '100px' }}
                                    format="YYYY"
                                />
                            </Form.Item>
                        ))}
                    </DateContent>
                ) : (
                    <DateContent>
                        {fields.map(field => (
                            <Form.Item name={field.name}>
                                <DatePicker format={format} />
                            </Form.Item>
                        ))}
                    </DateContent>
                )}
            </Content>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const Content = styled.div`
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    border: 1px solid #d9d9d9;
    padding: 0.5rem 0.5rem 0 0.5rem;
    gap: 0.5rem;
    flex-wrap: nowrap;
`;

const DateContent = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: nowrap;
`;
