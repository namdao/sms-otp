/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Alert,
  TextInput,
  NativeModules,
  NativeEventEmitter,
  ScrollView,
  Keyboard,
} from 'react-native';

// import {OTP, RNLogivanMobileSmsOtp} from '123';

import {OTP, RNLogivanMobileSmsOtp} from '@logivan/mobile-sms-otp';

const LGV_APP_ID = '728364811fda98382dd49f3ee5db0da6';
// const baseURL = 'https://logivan-testbed1.herokuapp.com';
const baseURL = 'https://logivan-testbed1.herokuapp.com';

class App extends React.Component {
  state = {text: ''};

  componentWillMount() {
    // const eventEmitter = new NativeEventEmitter(
    //   NativeModules.RNLogivanMobileSmsOtpTest,
    // );
    // eventEmitter.addListener('com.RNSmsRetriever:otpReceived', event => {
    //   console.log(event); // "someValue"
    //   const {message} = event;
    //   const index = message.indexOf(': ') + 2;
    //   this.setState({numeric: message.substr(index, 4)});
    // });
    // RNLogivanMobileSmsOtp.addListener(event => console.log('event ', event));
  }

  async componentDidMount() {
    // try {
    //   // const req = await RNLogivanMobileSmsOtp.requestHint();
    //   const req2 = await RNLogivanMobileSmsOtp.getOtp();
    //   // this.setState({text: req});
    //   console.log('req ', req2);
    //   // const req2 = await RNLogivanMobileSmsOtp.getOtp();
    //   // console.log('req ', req2);
    // } catch (e) {
    //   console.log('loi le te ', e);
    // }
  }

  componentWillUnmount() {
    // const eventEmitter = new NativeEventEmitter(
    //   NativeModules.RNLogivanMobileSmsOtpTest,
    // );
    // eventEmitter.removeAllListeners('com.RNSmsRetriever:otpReceived');
    // RNLogivanMobileSmsOtp.removeListener();
  }

  getHash = async () => {
    try {
      const req = await RNLogivanMobileSmsOtp.getHash();

      console.log('req ', req);
    } catch (e) {
      console.log('loi le te ', e);
    }
  };

  getOtp = async () => {
    try {
      const req = await RNLogivanMobileSmsOtp.getOtp();
      console.log('req ', req);
    } catch (e) {
      console.log('loi le te ', e);
    }
  };

  alertExample = () => {
    console.log('login loi from example');
  };

  onOTPSuccess = resultData => {
    this.closeAccountKit();
    setTimeout(
      () =>
        Alert.alert(
          'Notification',
          'Login Success',
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        ),
      500,
    );
  };

  closeAccountKit = () => {
    if (this.accountKit && this.accountKit.close) {
      this.accountKit.close();
    }
  };
  showAccountKit = () => {
    if (this.accountKit && this.accountKit.open) {
      this.accountKit.open();
    }
  };

  setRef = ref => {
    this.accountKit = ref;
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <TouchableOpacity onPress={this.showAccountKit}>
          <Text>Open OTP</Text>
        </TouchableOpacity>
        <View>
          <TextInput
            value={this.state.text}
            onChangeText={text => this.setState({text})}
            style={styles.textInput}
            keyboardType="decimal-pad"
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            autoCorrect={false}
          />
          {/* <TextInput
            value={this.state.text2}
            onChangeText={text2 => this.setState({text2})}
            autoCorrect={false}
            style={styles.textInput}
          /> */}
          <TextInput
            value={this.state.numeric}
            onChangeText={numeric => this.setState({numeric})}
            style={styles.textInput}
            keyboardType="numeric"
            autoCorrect={false}
            textContentType="none"
            // o
          />
          {/* <TextInput
              value={this.state.text}
              onChangeText={text => this.setState({text})}
              autoCorrect={false}
              style={styles.textInput}
              keyboardType="phone-pad"
            /> */}
        </View>
        <TouchableOpacity onPress={this.getHash} style={styles.btn}>
          <Text>get Hash</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.getOtp}>
          <Text>get Otp</Text>
        </TouchableOpacity>
        <OTP
          ref={this.setRef}
          onOTPSuccess={this.onOTPSuccess}
          onOTPError={() => console.log('loi')}
          trackingEvent={this.trackingEvent}
          appID={LGV_APP_ID}
          baseURL={baseURL}
          // renderCustomFooter={this.renderPrivacyAndPolicyText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    marginTop: 50,
    borderWidth: 1,
    borderColor: 'red',
    padding: 20,
  },
  btn: {
    marginVertical: 30,
  },
});

export default App;
