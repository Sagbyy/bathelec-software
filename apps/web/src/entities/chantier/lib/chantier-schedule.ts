import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type ChantierSchedule = {
  startDate?: string | null;
  endDate?: string | null;
};

export const toDateInputValue = (value?: string | null) =>
  value ? value.slice(0, 10) : '';

const parseCalendarDay = (value: string) => {
  const [year, month, day] = toDateInputValue(value).split('-').map(Number);
  return new Date(year!, month! - 1, day!);
};

const formatDay = (value: string) =>
  format(parseCalendarDay(value), 'd MMMM yyyy', { locale: fr });

export const formatChantierSchedule = ({
  startDate,
  endDate,
}: ChantierSchedule) => {
  if (!startDate) return 'Non programmé';
  if (!endDate || toDateInputValue(endDate) === toDateInputValue(startDate)) {
    return `Le ${formatDay(startDate)}`;
  }
  return `Du ${formatDay(startDate)} au ${formatDay(endDate)}`;
};
