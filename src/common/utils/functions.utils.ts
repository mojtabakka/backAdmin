export function AddMinutesToDate(date, minutes): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function isEmptyArray(data) {
  return !(isArray(data) ? data.length : false);
}

export const { isArray } = Array;
