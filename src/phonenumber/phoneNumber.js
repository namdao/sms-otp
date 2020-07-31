import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import KeyboardAware from '../components/KeyboardAware';
import FLAG from '../assest/vietnam-flag.png';
import AuthenConfig from '../AuthenConfig';
import { Colors, utility, Constant } from '../utils';
import styles from './styles';

export default class phoneNumber extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputPhone: '',
      errorMessage: '',
    };
    this.lastPhoneNumber = '';
    StatusBar.setBarStyle('dark-content');
    this.deboundNavigateOtp = utility.debounce(this.navigateToOtp, 200);
  }

  async componentDidMount() {
    try {
      if (Platform.OS === 'android') {
        const response = await NativeModules.RNLogivanMobileSmsOtp.requestHint();
        if (!!response && typeof response === 'string') {
          const phoneNumberValue = response.replace('+84', '0');
          this.setState({ inputPhone: phoneNumberValue });
        }
      }
    } catch {
      //
    }
  }

  renderHeader = () => {
    return (
      <View style={styles.ContainerHeader}>
        <Text style={styles.title}>Số điện thoại</Text>
        <Text style={styles.subTitle}>Chúng tôi sẽ gửi mã xác nhận qua số điện thoại của bạn</Text>
      </View>
    );
  };

  changeText = e => {
    const parsePhone = utility.getNumberOnly(e);
    this.setState({ inputPhone: parsePhone });
  };

  renderInputPhone = () => {
    const { inputPhone } = this.state;
    return (
      <View style={styles.containerPhoneNumber}>
        <Image style={styles.flag} source={FLAG} resizeMode="cover" />
        <Text style={styles.nationalStyle}>+84</Text>
        <TextInput
          value={inputPhone}
          onChangeText={this.changeText}
          style={styles.inputPhoneNumber}
          placeholderTextColor={Colors.brownGrey2}
          placeholder="91 234 56 78"
          keyboardType="decimal-pad"
          returnKeyType="done"
          autoFocus
        />
      </View>
    );
  };

  renderFooter = () => {
    const { renderCustomFooter } = AuthenConfig.getConfig() || {};
    if (!renderCustomFooter) return null;
    return <View style={styles.wrappFooter}>{renderCustomFooter()}</View>;
  };

  navigateToOtp = () => {
    const { trackingEvent } = AuthenConfig.getConfig() || {};
    const { inputPhone } = this.state;
    const { saveDataForSentOtp, onIndexChange } = this.props
    const fullPhoneNumber = utility.getPhoneNumber(inputPhone);
    const valid = utility.validPhoneNumber(fullPhoneNumber);
    let errorMessage = Constant.MESSAGE.ERROR_PHONE_NUMBER;
    if (valid) {
      errorMessage = '';
      const phoneAlias = utility.formatPhoneNumber(fullPhoneNumber);
      // Actions.push(screenNames.SCREEN_OTP, {
      //   currentPhoneNumber: fullPhoneNumber,
      //   lastPhoneNumber: this.lastPhoneNumber,
      //   phoneAlias,
      // });
      saveDataForSentOtp(fullPhoneNumber, this.lastPhoneNumber, phoneAlias)();
      onIndexChange(1)();
      this.lastPhoneNumber = fullPhoneNumber;
    }

    this.setState({ errorMessage });
    return
  };

  renderButtonNext = () => {
    const { colorsMain = Colors.main } = AuthenConfig.getConfig() || {};
    const { inputPhone } = this.state;
    const buttonColor = inputPhone !== '' ? colorsMain : Colors.brownGrey;
    return (
      <TouchableOpacity
        disabled={!inputPhone}
        onPress={this.deboundNavigateOtp}
        style={[styles.buttonNext, { backgroundColor: buttonColor }]}
      >
        <Text style={styles.textButton}>Tiếp tục</Text>
      </TouchableOpacity>
    );
  };

  renderErrorPhone = () => {
    const { errorMessage } = this.state;
    return errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>;
  };

  render() {
    return (
      <KeyboardAware>
        <View style={styles.wrapPhoneNumber}>
          <View>
            {this.renderHeader()}
            {this.renderInputPhone()}
            {this.renderErrorPhone()}
            {this.renderButtonNext()}
          </View>
          {this.renderFooter()}
        </View>
      </KeyboardAware>
    );
  }
}
