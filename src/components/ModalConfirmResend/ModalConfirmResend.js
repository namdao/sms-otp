import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

class ModalConfirmResend extends Component {
  static propTypes = {
    phoneNumber: PropTypes.string,
    onConfirm: PropTypes.func,
  };

  static defaultProps = {
    phoneNumber: '',
    onConfirm: () => null,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  openModal = () => {
    this.setState({ visible: true });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible } = this.state;
    const { onConfirm, phoneNumber } = this.props;

    return (
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={this.closeModal}>
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <View style={styles.contentWrapper}>
                <View style={styles.header}>
                  <Image style={styles.icon} source={require('../../assest/icResendSms.png')} />
                  <Text style={styles.greyText}>Gửi lại mã xác nhận</Text>
                </View>
                <View style={styles.mt10}>
                  <Text style={styles.bigText}>{phoneNumber}</Text>
                  <Text style={[styles.text, styles.mt10]}>
                    Chúng tôi sẽ gửi lại mã xác nhận qua tin nhắn SMS tới số điện thoại bạn yêu cầu
                  </Text>
                </View>
                <View style={[styles.footer, styles.mt10]}>
                  <TouchableOpacity
                    onPress={this.closeModal}
                    style={[styles.button, styles.blackButton]}
                  >
                    <Text style={styles.whiteText}>Trở về</Text>
                  </TouchableOpacity>
                  <View style={styles.gutter15} />
                  <TouchableOpacity
                    onPress={onConfirm}
                    style={[styles.button, styles.orangeButton]}
                  >
                    <Text style={styles.whiteText}>Gửi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default ModalConfirmResend;
