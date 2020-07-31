import React, { Component } from 'react';
import { Image, TouchableOpacity, View, SafeAreaView, BackHandler } from 'react-native';
import { View as AnimatableView } from 'react-native-animatable';
import { TabView } from 'react-native-tab-view';
/**
 * components
 */
import OTPScreen from './otp';
import OTPSCreenFirebase from './otp/otpFirebase';
import PhoneNumberScreen from './phonenumber';
/**
 * utils & constants
 */
import Screen from './utils/screen';
import screenNames from './screenNames';
import AuthenConfig from './AuthenConfig';
/** 
 * internal imports
 */
import styles from './styles';

const { SCREEN_PHONE_NUMBER, SCREEN_OTP } = screenNames;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleOtp: false,
      currentPhoneNumber: '',
      lastPhoneNumber: '',
      phoneAlias: '',
      index: 0,
      routes: [{ key: SCREEN_PHONE_NUMBER }, { key: SCREEN_OTP }],
    };
    AuthenConfig.setConfig(props);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    const { index } = this.state;
    if (index === 0) {
      this.setState({ isVisibleOtp: false });
      return;
    }
    if (index === 1) {
      this.onIndexChange(0)();
      return;
    }
  };

  saveDataForSentOtp = (currentPhoneNumber, lastPhoneNumber, phoneAlias) => () => {
    this.setState({ currentPhoneNumber, lastPhoneNumber, phoneAlias });
  };

  onIndexChange = index => () => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { ...rest } = this.state;
    const { usingFirebase = false } = this.props;
    const ScreenOtp = usingFirebase ? OTPSCreenFirebase : OTPScreen;
    switch (route.key) {
      case SCREEN_PHONE_NUMBER:
        return (
          <PhoneNumberScreen
            onIndexChange={this.onIndexChange}
            saveDataForSentOtp={this.saveDataForSentOtp}
          />
        );
      case SCREEN_OTP:
        return <ScreenOtp {...rest} onIndexChange={this.onIndexChange} />;
      default:
        return null;
    }
  };

  renderTabBar = () => null;

  open = () => {
    this.setState({ isVisibleOtp: true });
  };

  close = () => {
    this.setState({ isVisibleOtp: false });
  };


  render() {
    const { isVisibleOtp } = this.state;
    if (!isVisibleOtp) return null;
    const { indexLayer = 1000 } = this.props;
    const indexLayerStyle = { zIndex: indexLayer, elevation: indexLayer };
    return (
      <View style={[styles.container, indexLayerStyle]}>
        <SafeAreaView style={styles.flex1}>
          <AnimatableView
            duration={500}
            animation="slideInUp"
            useNativeDriver
            style={styles.container}
          >
            <TouchableOpacity onPress={this.handleBackButton}>
              <Image style={styles.backIcon} source={require('./assest/icBack.png')} />
            </TouchableOpacity>
            <TabView
              swipeEnabled={false}
              navigationState={this.state}
              onIndexChange={this.onIndexChange}
              renderScene={this.renderScene}
              initialLayout={Screen.screenWidth}
              renderTabBar={this.renderTabBar}
              lazy
            />
          </AnimatableView>
        </SafeAreaView>
      </View>
    );
  }
}
export default App;
