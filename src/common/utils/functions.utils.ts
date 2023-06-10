export function AddMinutesToDate(date, minutes): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function isEmptyArray(data) {
  return !(isArray(data) ? data.length : false);
}

export function isEmptyObject(data) {
  return !(isObject(data) ? Object.keys(data).length : false);
}
export function isObject(data) {
  return data !== null && typeof data === 'object' && !isArray(data);
}
export const { isArray } = Array;
