import React, { Component } from 'react';
import {
  View,
  TextInput,
  Clipboard,
  Platform,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { utility } from '../../utils';
import { isAutoFillSupported } from './helpers/device';

export default class OTPInputView extends Component {
  constructor(props) {
    super(props);
    const { code } = props;
    this.fields = [];
    this._timer = null;
    this.hasCheckedClipBoard = false;
    this.clipBoardCode = '';
    this.state = {
      digits: code === undefined ? [] : code.split(''),
      selectedIndex: 0,
    };
  }

  async UNSAFE_componentWillMount() {
    if (Platform.OS === 'android') {
      const eventEmitter = new NativeEventEmitter(NativeModules.RNLogivanMobileSmsOtp);
      eventEmitter.addListener('com.logivanotp:otpReceived', this.handleSaveDigitsFromMessage);
      NativeModules.RNLogivanMobileSmsOtp.getOtp();
    }
  }

  componentDidMount() {
    this.copyCodeFromClipBoardOnAndroid();
    this.bringUpKeyBoardIfNeeded();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { code } = this.props;
    if (nextProps.code !== code) {
      this.setState({
        digits: nextProps.code === undefined ? [] : nextProps.code.split(''),
      });
    }
  }

  componentWillUnmount() {
    if (this._timer) {
      clearInterval(this._timer);
    }
    if (Platform.OS === 'android') {
      const eventEmitter = new NativeEventEmitter(NativeModules.RNLogivanMobileSmsOtp);
      eventEmitter.removeAllListeners('com.logivanotp:otpReceived');
    }
  }

  clearDigits = () => this.setState({ digits: [] });

  handleSaveDigitsFromMessage = event => {
    try {
      const { onSubmit } = this.props;
      const { message } = event;
      const indexOfDigitCodes = message.indexOf(': ');
      if (indexOfDigitCodes !== -1) {
        const index = indexOfDigitCodes + 2;
        const finalCode = message.substr(index, 4);
        this.setState({ digits: finalCode.split('') }, () => {
          this.notifyCodeChanged();
          onSubmit();
        });
      }
    } catch (error) {
      //
      console.log(error);
    }
  };

  copyCodeFromClipBoardOnAndroid = () => {
    if (Platform.OS === 'android') {
      this.checkPinCodeFromClipBoard();
      this._timer = setInterval(() => {
        this.checkPinCodeFromClipBoard();
      }, 400);
    }
  };

  bringUpKeyBoardIfNeeded = () => {
    const { autoFocusOnLoad, pinCount } = this.props;
    const digits = this.getDigits();
    const focusIndex = digits.length ? digits.length - 1 : 0;
    if (focusIndex < pinCount && autoFocusOnLoad) {
      this.focusField(focusIndex);
    }
  };

  getDigits = () => {
    const { digits: innerDigits } = this.state;
    const { code } = this.props;
    return code === undefined ? innerDigits : code.split('');
  };

  notifyCodeChanged = () => {
    const { digits } = this.state;
    const code = digits.join('');
    const { onCodeChanged } = this.props;
    if (onCodeChanged) {
      onCodeChanged(code);
    }
  };

  checkPinCodeFromClipBoard = () => {
    const { pinCount } = this.props;
    Clipboard.getString()
      .then(code => {
        if (this.hasCheckedClipBoard && code.length === pinCount && this.clipBoardCode !== code) {
          this.setState({ digits: code.split('') }, () => {
            this.blurAllFields();
            this.notifyCodeChanged();
          });
        }
        this.clipBoardCode = code;
        this.hasCheckedClipBoard = true;
      })
      .catch(e => e);
  };

  handleOneDigit = (index, text) => {
    const { digits } = this.state;
    const { pinCount } = this.props;

    const parseNumber = utility.getNumberOnly(text);

    digits[index] = parseNumber || '';

    // Clear digit
    if (!text && index > 0) {
      this.focusField(index - 1);
    }

    // Fill in digit
    if (index < pinCount - 1 && !!parseNumber) {
      this.focusField(index + 1);
    }

    // Last index
    if (index === pinCount - 1) {
      const result = digits.join('');
      if (result.length === pinCount) {
        this.blurAllFields();
      }
    }
    this.setState({ digits }, this.notifyCodeChanged);
  };

  handleReplaceDigit = (index, text) => {
    // text will have length 2
    const { digits } = this.state;
    const { pinCount } = this.props;

    let newText = text.replace(digits[index], '');

    newText = newText === '' ? digits[index] : newText;
    digits[index] = newText;

    if (index < pinCount - 1) {
      this.focusField(index + 1);
    } else {
      this.blurAllFields();
    }

    this.setState({ digits }, this.notifyCodeChanged);
  };

  handleMultiTextAtSameTime = (index, text) => {
    const { digits } = this.state;
    const { pinCount } = this.props;

    let mappingIndex = index;

    text.split('').forEach(char => {
      digits[mappingIndex] = char;
      if (mappingIndex < pinCount - 1) {
        mappingIndex += 1;
      }
    });

    // BUG HERE
    // this.focusField(mappingIndex);
    this.setState({ digits }, this.notifyCodeChanged);
  };

  handleChangeText = (index, text) => {
    // Handle not 1 digit
    if (text.length > 1) {
      if (text.length === 2) {
        this.handleReplaceDigit(index, text);
        return;
      }
      this.handleMultiTextAtSameTime(index, text);
      return;
    }

    this.handleOneDigit(index, text);
  };

  handleKeyPressTextInput = (index, key) => {
    const digits = this.getDigits();
    if (key === 'Backspace') {
      if (!digits[index] && index > 0) {
        this.focusField(index - 1);
      }
    }
  };

  setSelection = index => {
    const { digits } = this.state;
    if (!this.fields[index] || Platform.OS === 'android') return;
    this.fields[index].setNativeProps({
      selection: digits[index] ? { start: 0, end: digits[index].length } : { start: 0, end: 0 },
    });
  };

  focusField = index => {
    if (index < this.fields.length) {
      this.fields[index].focus();
      this.setSelection(index);
      this.setState({ selectedIndex: index });
    }
  };

  onUserFocus = index => {
    const { selectedIndex } = this.state;
    this.setSelection(index);

    if (selectedIndex === index) return;

    this.setState({ selectedIndex: index });
  };

  blurAllFields = () => {
    this.fields.forEach(field => field.blur());
    this.setState({ selectedIndex: -1 });
  };

  // eslint-disable-next-line
  renderOneInputField = (_, index) => {
    const {
      codeInputFieldStyle,
      codeInputHighlightStyle,
      codeInputFieldEmptyStyle,
      secureTextEntry,
      textInputProps,
    } = this.props;
    const { defaultTextFieldStyle } = styles;
    const { selectedIndex, digits } = this.state;
    return (
      <View key={`${index}view`}>
        <TextInput
          selectTextOnFocus={Platform.OS === 'android'}
          underlineColorAndroid="rgba(0,0,0,0)"
          style={[
            defaultTextFieldStyle,
            codeInputFieldStyle,
            selectedIndex === index ? codeInputHighlightStyle : null,
            !digits[index] ? codeInputFieldEmptyStyle : null,
          ]}
          ref={ref => {
            this.fields[index] = ref;
          }}
          onFocus={() => this.onUserFocus(index)}
          onChangeText={text => {
            this.handleChangeText(index, text);
          }}
          onKeyPress={({ nativeEvent: { key } }) => {
            this.handleKeyPressTextInput(index, key);
          }}
          value={digits[index]}
          keyboardType="decimal-pad"
          textContentType={isAutoFillSupported ? 'oneTimeCode' : 'none'}
          key={index}
          secureTextEntry={secureTextEntry}
          {...textInputProps}
        />
      </View>
    );
  };

  renderTextFields = () => {
    const { pinCount } = this.props;
    const array = new Array(pinCount).fill(0);
    return array.map(this.renderOneInputField);
  };

  render() {
    const { containerStyle } = this.props;
    return (
      <View style={containerStyle}>
        <View style={styles.wrapper}>{this.renderTextFields()}</View>
      </View>
    );
  }
}

OTPInputView.propTypes = {
  pinCount: PropTypes.number,
  containerStyle: PropTypes.shape({}),
  codeInputFieldStyle: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.array]).isRequired,
  codeInputHighlightStyle: PropTypes.shape({}),
  codeInputFieldEmptyStyle: PropTypes.shape({}),
  onCodeChanged: PropTypes.func,
  autoFocusOnLoad: PropTypes.bool,
  code: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  textInputProps: PropTypes.shape({}),
  onSubmit: PropTypes.func,
};

OTPInputView.defaultProps = {
  pinCount: 6,
  containerStyle: null,
  codeInputFieldStyle: null,
  codeInputHighlightStyle: null,
  codeInputFieldEmptyStyle: null,
  onCodeChanged: () => null,
  autoFocusOnLoad: true,
  secureTextEntry: false,
  code: undefined,
  textInputProps: {},
  onSubmit: () => null,
};
