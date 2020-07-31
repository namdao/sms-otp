import { StyleSheet } from 'react-native';
import { Colors, Common } from '../../utils';

const { width } = Common;

export default StyleSheet.create({
  defaultTextFieldStyle: {
    width: width.res45,
    height: width.res45,
    borderColor: Colors.paleGrey2,
    borderWidth: width.res1,
    borderRadius: width.res2,
    textAlign: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
