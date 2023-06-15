import { log } from 'console';

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

export function getWordsonPersiankyboard(word): string {
  [
    { en: 'q', fa: 'ض' },
    { en: 'w', fa: 'ص' },
    { en: 'e', fa: 'ث' },
    { en: 'r', fa: 'ق' },
    { en: 't', fa: 'ف' },
    { en: 'y', fa: 'غ' },
    { en: 'u', fa: 'ع' },
    { en: 'i', fa: 'i' },
    { en: 'o', fa: 'خ' },
    { en: 'p', fa: 'ح' },
    { en: 'a', fa: 'ش' },
    { en: 's', fa: 'س' },
    { en: 'd', fa: 'ی' },
    { en: 'f', fa: 'ب' },
    { en: 'g', fa: 'ل' },
    { en: 'h', fa: 'ا' },
    { en: 'j', fa: 'ت' },
    { en: 'k', fa: 'ن' },
    { en: 'l', fa: 'م' },
    { en: 'z', fa: 'ظ' },
    { en: 'x', fa: 'ظ' },
    { en: 'c', fa: 'ز' },
    { en: 'v', fa: 'ر' },
    { en: 'b', fa: 'ذ' },
    { en: 'n', fa: 'د' },
    { en: 'm', fa: 'پ' },
    { en: '1', fa: '۱' },
    { en: '2', fa: '۲' },
    { en: '3', fa: '۳' },
    { en: '4', fa: '۴' },
    { en: '5', fa: '۵' },
    { en: '6', fa: '۶' },
    { en: '7', fa: '۷' },
    { en: '8', fa: '۸' },
    { en: '9', fa: '۹' },
    { en: '0', fa: '۰' },
  ].forEach((item) => {
    const replace = `${item.en}\\d`;
    const re = new RegExp(replace, 'g');
    console.log(word.replace(re, item.fa));
    word = word.replace(re, item.fa);
  });
  return word;
}
