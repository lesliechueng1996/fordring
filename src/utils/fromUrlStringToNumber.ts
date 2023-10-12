import isNullOrUndefined from './isNullOrUndefined';

const fromUrlStringToNumber = (defaultValue: number, str?: string | null) => {
  if (isNullOrUndefined(str)) {
    return defaultValue;
  }
  const num = parseInt(str as string);
  if (isNaN(num)) {
    return defaultValue;
  }
  return num;
};

export default fromUrlStringToNumber;
