import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const COUNTDOWN_DURATION = 1000 * 300; // 5 minutes

export default class Countdown extends Component {
  static propTypes = {
    onCountingStart: PropTypes.func,
    onCountingDone: PropTypes.func,
    countDownDuration: PropTypes.number,
  };

  static defaultProps = {
    onCountingStart: () => null,
    onCountingDone: () => null,
    countDownDuration: COUNTDOWN_DURATION,
  };

  constructor(props) {
    super(props);
    this.state = {
      minutes: 0,
      seconds: 0,
      isCounting: false,
    };
    this.timer = null;
    this.endTime = 0;
    this.remaining = 0;
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  get duration() {
    const { countDownDuration } = this.props;
    return this.remaining <= 0 ? countDownDuration : this.remaining;
  }

  start = remaining => {
    const { onCountingDone, onCountingStart } = this.props;
    if (this.timer) return; // if timer is still running, just skip

    onCountingStart();

    try {
      this.remaining = Number(remaining) || 0;
    } catch (error) {
      this.remaining = 0;
    }

    this.endTime = new Date().getTime() + this.duration;

    this.timer = setInterval(() => {
      //  Add buffer 1000ms because of interval = 1000
      const distance = this.endTime - new Date().getTime() + 1000;
      this.remaining = distance;

      if (distance <= 0) {
        this.clearRemaining(this.reset);
        onCountingDone();
        return;
      }
      this.setState({
        ...this.getResult(distance),
        isCounting: true,
      });
    }, 1000);
  };

  reset = () => {
    clearInterval(this.timer);
    this.timer = null;
    this.setState({ minutes: 0, seconds: 0, isCounting: false });
  };

  getRemaining = (callback = () => null) => {
    try {
      const result = Number(this.remaining) || 0;
      callback(result);
    } catch (error) {
      callback(0);
    }
  };

  clearRemaining = (callback = () => null) => {
    this.remaining = 0;
    callback();
  };

  getResult = distance => {
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { minutes, seconds };
  };

  formatDisplayResult = () => {
    const { minutes, seconds } = this.state;
    const formattedSeconds = seconds > 9 ? seconds : `0${seconds}`;
    return `Yêu cầu mã xác nhận mới ${minutes}:${formattedSeconds}`;
  };

  render() {
    const { isCounting } = this.state;

    return (
      isCounting && (
        <View style={styles.container}>
          <Text style={styles.text}>{this.formatDisplayResult()}</Text>
        </View>
      )
    );
  }
}
