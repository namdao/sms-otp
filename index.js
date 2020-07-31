import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import OTP from './src';

const eventEmitter =
  Platform.OS === 'ios' ? {} : new NativeEventEmitter(NativeModules.RNLogivanMobileSmsOtp);

const RNLogivanMobileSmsOtp =
  Platform.OS === 'ios'
    ? {
        getOtp: () => new Promise(),
        getHash: () => new Promise(),
        requestHint: () => new Promise(),
        addListener: () => new Promise(),
        removeListener: () => new Promise(),
      }
    : {
        addListener: eventEmitter.addListener,
        removeAllListeners: eventEmitter.removeAllListeners,
        requestHint: NativeModules.RNLogivanMobileSmsOtp.requestHint,
        getOtp: NativeModules.RNLogivanMobileSmsOtp.getOtp,
        getHash: NativeModules.RNLogivanMobileSmsOtp.getHash,
      };

export { OTP, RNLogivanMobileSmsOtp };
