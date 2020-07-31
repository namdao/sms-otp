import React from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

const Loading = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <Modal visible transparent>
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    </Modal>
  );
};

export default Loading;

Loading.propTypes = {
  isLoading: PropTypes.bool,
};

Loading.defaultProps = {
  isLoading: false,
};
