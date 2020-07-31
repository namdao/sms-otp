import React, { Component } from 'react';
import AuthenConfig from '../AuthenConfig';

export const withOTPFirebaseBusinessLogic = WrappedComponent => {
  class OTPBusinessLogic extends Component {

    sendOTP = async (phoneNumber, callback = () => null, hash) => {
      try {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        return callback(confirmation);
      } catch (error) {
        throw error;
      }
    };

    verifyOTP = async (confirm, otpCode, callback = () => null) => {
      try {
        const resultConfirm = await confirm.confirm(otpCode);
        const { onOTPSuccess } = AuthenConfig.getConfig();
        onOTPSuccess(resultConfirm);
      } catch (error) {
        console.log('Invalid code.');
        callback(false);
      }
    };

    render() {
      return <WrappedComponent {...this.props} sendOTP={this.sendOTP} verifyOTP={this.verifyOTP} />;
    }
  }

  OTPBusinessLogic.displayName = `OTPBusinessLogic(${WrappedComponent.displayName})`;

  return OTPBusinessLogic;
};
