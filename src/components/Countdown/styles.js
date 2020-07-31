import { StyleSheet } from 'react-native';
import Common from '../../utils/common';
import Colors from '../../utils/colors';

const { font, width } = Common;

export default StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  text: {
    fontSize: font.res10,
    color: Colors.brownGrey2,
    fontWeight: '500',
    marginTop: width.res15,
  },
});
