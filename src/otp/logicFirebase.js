import React, { Component } from 'react';
import auth from '@react-native-firebase/auth';

export const withOTPFirebaseBusinessLogic = WrappedComponent => {
  class OTPBusinessLogic extends Component {
    confirmation = null;

    sendOTP = async (phoneNumber, callback = () => null, resend = false) => {
      try {
        this.confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        return callback({ status: true });
      } catch (error) {
        callback({ status: false, error });
      }
    };

    verifyOTP = async (otpCode, callback = () => null) => {
      try {
        const resultConfirm = await this.confirmation.confirm(otpCode);
        callback({ status: true, resultConfirm });
      } catch (error) {
        callback({ status: false, error });
      }
    };

    render() {
      return <WrappedComponent {...this.props} sendOTP={this.sendOTP} verifyOTP={this.verifyOTP} />;
    }
  }

  OTPBusinessLogic.displayName = `OTPBusinessLogic(${WrappedComponent.displayName})`;

  return OTPBusinessLogic;
};
