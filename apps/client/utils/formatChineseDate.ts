const months = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

// 七月 28, 2022
export default function formatChineseDate(timestamp: Date) {
  const year = timestamp.getFullYear();
  const month = timestamp.getMonth();
  const date = timestamp.getDate();

  return `${months[month]} ${date}, ${year}`;
}
