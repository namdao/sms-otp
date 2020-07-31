import { StyleSheet } from 'react-native';
import Colors from '../../utils/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black75,
  },
});
