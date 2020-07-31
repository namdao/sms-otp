import { StyleSheet } from 'react-native';
import Common from './utils/common';
import Colors from './utils/colors';

const { width, height } = Common;

export default StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  flex1: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backIcon: {
    width: width.res24,
    height: width.res24,
    marginLeft: width.res15,
    marginTop: height.res25,
  },
});
