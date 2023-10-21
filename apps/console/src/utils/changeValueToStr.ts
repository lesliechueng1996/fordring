import isNullOrUndefined from './isNullOrUndefined';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function changeValueToStr(obj: any) {
  const newObj: Record<string, string> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const oldValue = obj[key];
      newObj[key] = isNullOrUndefined(oldValue) ? '' : typeof oldValue === 'string' ? oldValue : String(oldValue);
    }
  }
  return newObj;
}
