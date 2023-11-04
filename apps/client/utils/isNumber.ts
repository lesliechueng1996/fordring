function isNumber(obj: unknown) {
  return typeof obj === 'number' && !isNaN(obj);
}

export default isNumber;
