import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Keyboard, ViewPropTypes } from 'react-native';
import Platform from '../../utils/platform';
import styles from './styles';

const { KeyboardEvent } = Platform;

export default class KeyboardAwareComponent extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    children: null,
    style: {},
  };

  constructor(props) {
    super(props);
    this.keyboardHeight = new Animated.Value(0);
    this.state = {
      isKeyboardVisible: false,
    };
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(KeyboardEvent.Show, this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener(KeyboardEvent.Hide, this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = event => {
    this.setState({ isKeyboardVisible: true }, () => {
      if (Platform.isAndroid) return;

      Animated.parallel([
        Animated.timing(this.keyboardHeight, {
          duration: event.duration,
          toValue: event.endCoordinates.height,
        }),
      ]).start();
    });
  };

  keyboardWillHide = event => {
    if (Platform.isAndroid) {
      this.setState({ isKeyboardVisible: false });
      return;
    }
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
      }),
    ]).start(() => this.setState({ isKeyboardVisible: false }));
  };

  render() {
    const { children, style, ...props } = this.props;
    const { isKeyboardVisible } = this.state;
    return (
      <Animated.View
        style={[
          styles.container,
          { paddingBottom: Platform.isAndroid ? 0 : this.keyboardHeight }, //eslint-disable-line
          style,
        ]}
        {...props}
      >
        {typeof children === 'function' ? children(isKeyboardVisible) : children}
      </Animated.View>
    );
  }
}
