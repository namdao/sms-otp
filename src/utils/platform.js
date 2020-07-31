import { Platform as NativePlatform } from 'react-native';

const PLATFORM = NativePlatform.OS;
const isAndroid = PLATFORM === 'android';
const isIos = PLATFORM === 'ios';

const KeyboardEvent = {
  Show: isIos ? 'keyboardWillShow' : 'keyboardDidShow',
  Hide: isIos ? 'keyboardWillHide' : 'keyboardDidHide',
};

// eslint-disable-next-line
const isDev = !!global.__DEV__;

const Platform = {
  isDev,
  isIos,
  isAndroid,
  OS: PLATFORM,
  KeyboardEvent,
};

export default Platform;
