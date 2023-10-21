import dayjs from 'dayjs';

export default function toDateString(time: number) {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}
