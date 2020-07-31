import React, { Component } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import AuthenConfig from '../AuthenConfig';
import endpoints from '../utils/api';
import { EVENT_ACTION } from '../utils/constant';

const { SEND_OTP_ENDPOINT, VERIFY_OTP_ENDPOINT } = endpoints;

export const withOTPBusinessLogic = WrappedComponent => {
  class OTPBusinessLogic extends Component {
    constructor(props) {
      super(props);
      const { baseURL } = AuthenConfig.getConfig();
      this.network = axios.create({
        baseURL,
        timeout: 60 * 1000, // 1 minutes
        Accept: 'application/json',
        'Content-Type': 'application/json',
        DeviceID: DeviceInfo.getDeviceId(),
        Platform: Platform.OS,
      });
      this.network.interceptors.response.use(
        response => response ?.data || {},
        error => Promise.reject(error)
      );
    }

    sendOTP = (phoneNumber, hash, callback = () => null) => {
      const { appID } = AuthenConfig.getConfig();

      const data = {
        phone_number: phoneNumber,
        app_id: appID,
        platform: Platform.OS,
        hash,
      };
      this.network
        .post(SEND_OTP_ENDPOINT, data)
        .then(res => {
          callback(res);
        })
        .catch(error => {
          callback(error);
        });
    };

    verifyOTP = (phoneNumber, otpCode, callback = () => null) => {
      const { appID, onOTPSuccess, onOTPError, trackingEvent } = AuthenConfig.getConfig();

      const data = {
        phone_number: phoneNumber,
        otp_code: otpCode,
        app_id: appID,
      };
      trackingEvent(EVENT_ACTION.LOGIN_ATTEMPTS);
      this.network
        .post(VERIFY_OTP_ENDPOINT, data)
        .then(result => {
          const { otp_token } = result || {};
          const resultData = {
            otp_token,
            phone_number: phoneNumber,
            app_id: appID,
          };

          callback(otp_token);
          onOTPSuccess(resultData);
        })
        .catch(error => {
          trackingEvent(EVENT_ACTION.OTP_FAIL);
          onOTPError(error);
          callback(error);
        });
    };

    render() {
      return <WrappedComponent {...this.props} sendOTP={this.sendOTP} verifyOTP={this.verifyOTP} />;
    }
  }

  OTPBusinessLogic.displayName = `OTPBusinessLogic(${WrappedComponent.displayName})`;

  return OTPBusinessLogic;
};
