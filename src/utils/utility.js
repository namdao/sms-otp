import { format } from 'libphonenumber-js';

// Scale for multinational
const REGEXPHONE = {
  'vi-VN': /^(\+?84|0)((3([2-9]))|(5([2689]))|(7([0|6-9]))|(8([1-6|89]))|(9([0-9])))([0-9]{7})$/,
};

export const getPhoneNumber = phoneNumber => {
  const isString = typeof phoneNumber === 'string' || phoneNumber instanceof String;
  if (!isString) return isString;
  const parsePhone = phoneNumber[0] !== '0' ? phoneNumber : phoneNumber.slice(1);
  return `+84${parsePhone}`;
};
export const validPhoneNumber = (phoneNumber, countryCode = 'vi-VN') => {
  return !!(phoneNumber && REGEXPHONE[countryCode].test(phoneNumber));
};

export const formatPhoneNumber = phoneNumber => {
  const phoneFormat = format(phoneNumber, 'INTERNATIONAL');
  return phoneFormat || null;
};

export const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction() {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context);
  };
};

export const getNumberOnly = (value = '') => value.replace(/[^\d]+/g, '');
