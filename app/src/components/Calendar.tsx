import { useMemo } from 'react';

import { format, getDay, parse, startOfWeek } from 'date-fns';
import en from 'date-fns/locale/en-US';
import pt from 'date-fns/locale/pt-BR';
import {
    Calendar as BigCalendar,
    CalendarProps,
    dateFnsLocalizer,
    Event,
    Messages,
    SlotInfo
} from 'react-big-calendar';
import styled from 'styled-components';

import useTranslationState from '@states/TranslationState';

type Props = {
    className?: string;
    selectable?: boolean;
    events: Event[];
    onSelectEvent?: (event: Event) => void;
    onSelectSlot?: (slotInfo: SlotInfo) => void;
};

export const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { pt, en }
});

export default function Calendar({ className, selectable, events, onSelectEvent, onSelectSlot }: Props) {
    const { translation, language } = useTranslationState();

    const messages = useMemo<Messages>(
        () => ({
            date: translation('Data'),
            time: translation('Hora'),
            event: translation('Evento'),
            allDay: translation('Dia todo'),
            week: translation('Semana'),
            work_week: translation('Dias úteis'),
            day: translation('Dia'),
            month: translation('Mês'),
            previous: translation('Anterior'),
            next: translation('Próximo'),
            yesterday: translation('Ontem'),
            tomorrow: translation('Amanhã'),
            today: translation('Hoje'),
            agenda: translation('Agenda'),
            noEventsInRange: translation('Não há eventos neste intervalo.'),
            showMore: count => translation('Mais {{count}}', { count })
        }),
        [language]
    );

    return (
        <Container
            popup
            className={className}
            culture={language}
            localizer={localizer}
            messages={messages}
            selectable={selectable}
            events={events}
            onSelectEvent={onSelectEvent}
            onSelectSlot={onSelectSlot}
        />
    );
}

const Container = styled(BigCalendar)<CalendarProps>`
    span {
        display: block;
    }

    span:first-letter {
        text-transform: uppercase;
    }

    .rbc-header {
        span {
            text-transform: capitalize;
        }
    }
`;
