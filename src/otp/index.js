import React, { Component } from 'react';
import { View, Text, Platform, TouchableOpacity, Alert } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../utils/colors';
import { MESSAGE, ERR_CODE, EVENT_ACTION } from '../utils/constant';
import OTPInput from '../components/OTPInput';
import styles from './styles';
import KeyboardAware from '../components/KeyboardAware';
import Countdown from '../components/Countdown';
import { withOTPBusinessLogic } from './logic';
import ModalConfirmResend from '../components/ModalConfirmResend';
import Loading from '../components/Loading';
import { debounce } from '../utils/utility';
import AuthenConfig from '../AuthenConfig';
import { RNLogivanMobileSmsOtp } from '../../index';

const PIN_COUNT = 4;

class OTPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      isCodeFilled: false,
      isLoading: false,
      isCountingDone: true,
      hash: '',
      errorMessage: '',
    };
    this.countDown = null;
    this.modal = null;
    this.debouncedOnSubmit = debounce(this.onSubmit, 200);
    this.debouncedOnResendOTP = debounce(this.onResendOTP, 200);
  }

  async componentDidMount() {
    this.onSendOTPFirstTime();
    if (Platform.OS === 'android') {
      const hash = await RNLogivanMobileSmsOtp.getHash();
      this.setState({
        hash,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.currentPhoneNumber !== this.props.currentPhoneNumber &&
      !!prevProps.currentPhoneNumber
    ) {
      this.isCountingDone = true;
      this.countDown && this.countDown.reset();
      this.OTPInputRef && this.OTPInputRef.clearDigits();
      this.setState(
        {
          code: '',
          isCodeFilled: false,
          isLoading: false,
          errorMessage: '',
        },
        this.onResend
      );
    }
  }
  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(_, nextState) {
    const { isCodeFilled, isLoading, isCountingDone, errorMessage } = this.state;
    const {
      isCodeFilled: nextIsCodeFilled,
      isLoading: nextIsLoading,
      isCountingDone: nextIsCountingDone,
      errorMessage: nextMessage,
    } = nextState;
    return (
      isCodeFilled !== nextIsCodeFilled ||
      isLoading !== nextIsLoading ||
      isCountingDone !== nextIsCountingDone ||
      errorMessage !== nextMessage
    );
  }

  checkIsCodeFilled = code => {
    this.setState({ code, isCodeFilled: code.length === PIN_COUNT, errorMessage: '' });
  };

  onSubmit = () => {
    const { code, isCodeFilled } = this.state;
    const { verifyOTP, currentPhoneNumber } = this.props;
    if (!isCodeFilled) return;

    this.startLoading();
    verifyOTP(currentPhoneNumber, code, this.endLoading);
  };

  sendOTP = () => {
    const { sendOTP: businessSendOTP, currentPhoneNumber } = this.props;
    const { hash } = this.state;
    this.startLoading();
    businessSendOTP(currentPhoneNumber, hash, this.endLoading);
  };

  onSendOTPFirstTime = () => {
    this.countDown.clearRemaining(() => {
      this.sendOTP();
    });
  };

  onResendOTP = () => {
    const { isCountingDone } = this.state;
    if (isCountingDone) {
      if (this.modal) {
        this.modal.closeModal();
      }
      this.startCount();
      const { trackingEvent } = AuthenConfig.getConfig();
      trackingEvent(EVENT_ACTION.OTP_RESEND);
      this.sendOTP();
    }
  };

  startCount = data => {
    if (this.countDown) {
      const remainTime = data ?.remaining * 1000 || 0;
      this.countDown.start(remainTime);
    }
  };

  onCountingDone = () => {
    this.setState({ isCountingDone: true });
  };

  onCountingStart = () => {
    this.setState({ isCountingDone: false });
  };

  openModal = () => {
    const { isCountingDone } = this.state;
    if (!isCountingDone) return;

    this.modal.openModal();
  };

  startLoading = () => {
    this.setState({ isLoading: true });
  };

  endLoading = result => {
    this.setState({ isLoading: false }, () => {
      if (result instanceof Error) {
        setTimeout(() => {
          const errorStatus = result ?.response ?.status;
          if (errorStatus === 422) {
            const errorData = result ?.response ?.data ?._error;
            const errorCode = errorData ?.code;
            let errorMessage = '';
            switch (errorCode) {
              case ERR_CODE.ARE_0001:
                errorMessage = MESSAGE.ARE_0001;
                break;
              case ERR_CODE.ARE_0002:
              case ERR_CODE.ARE_0003:
                this.setState({ errorMessage: MESSAGE.ARE_0002 });
                return;
              case ERR_CODE.ARE_0004: {
                errorMessage = MESSAGE.ARE_0004;
                break;
              }
              case ERR_CODE.ARE_0009: {
                // Specific case with phone number get code in 2 minutes
                const timing = errorData ?.message;
                const data = {
                  remaining: timing,
                };
                this.startCount(data);
                return;
              }
              default: {
                errorMessage = MESSAGE.ERROR_DEFAULT;
              }
            }
            Alert.alert(MESSAGE.ERROR_TITLE, errorMessage);
          }
        }, 100);
      } else {
        const data = {
          remaining: result ?.next_otp_remain_time,
        };
        this.startCount(data);
      }
    });
  };

  renderErrorMessage = () => {
    const { errorMessage } = this.state;
    return !!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>;
  };

  render() {
    const { isLoading, errorMessage, isCountingDone } = this.state;
    const { phoneAlias } = this.props;
    const { colorsMain = Colors.main } = AuthenConfig.getConfig() || {};
    const styleError = errorMessage ? styles.inputError : null;
    return (
      <KeyboardAware>
        <View style={styles.container}>
          <Text style={[styles.title, styles.mb10]}>Mã xác nhận </Text>
          <Text style={styles.text}>
            Nhập mã xác nhận đã gửi qua số{' '}
            <Text style={styles.boldText}>{phoneAlias || 'Không xác định'}</Text>
          </Text>
          <OTPInput
            containerStyle={styles.otpInputContainer}
            pinCount={PIN_COUNT}
            autoFocusOnLoad
            onCodeChanged={this.checkIsCodeFilled}
            codeInputFieldStyle={[styles.input, styleError]}
            codeInputFieldEmptyStyle={styles.inputEmpty}
            textInputProps={{
              selectionColor: Platform.OS === 'ios' ? Colors.black : Colors.black20,
            }}
            ref={this.setOTPInputRef}
          />
          {this.renderErrorMessage()}
          <TouchableOpacity
            onPress={this.debouncedOnSubmit}
            style={[styles.submitButton, styles.mt15, { backgroundColor: colorsMain }]}
          >
            <Text style={styles.whiteText}>Tiếp theo</Text>
          </TouchableOpacity>
          <Countdown
            onCountingStart={this.onCountingStart}
            onCountingDone={this.onCountingDone}
            ref={this.setCountdownRef}
          />
          {isCountingDone && (
            <View style={styles.bottom}>
              <TouchableOpacity onPress={this.openModal} style={styles.resendButton}>
                <Text style={styles.orangeText}>Gửi lại mã xác nhận?</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <ModalConfirmResend
          phoneNumber={phoneAlias}
          ref={this.setModalRef}
          onConfirm={this.debouncedOnResendOTP}
        />
        <Loading isLoading={isLoading} />
      </KeyboardAware>
    );
  }

  setCountdownRef = ref => {
    this.countDown = ref;
  };

  setModalRef = ref => {
    this.modal = ref;
  };

  setOTPInputRef = ref => {
    this.OTPInputRef = ref;
  };
}

OTPScreen.propTypes = {
  currentPhoneNumber: PropTypes.string,
  phoneAlias: PropTypes.string,
  sendOTP: PropTypes.func,
  verifyOTP: PropTypes.func,
};

OTPScreen.defaultProps = {
  currentPhoneNumber: '',
  phoneAlias: '',
  sendOTP: () => null,
  verifyOTP: () => null,
};

export default withOTPBusinessLogic(OTPScreen);
