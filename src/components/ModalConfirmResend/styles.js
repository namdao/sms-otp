import { StyleSheet } from 'react-native';
import Colors from '../../utils/colors';
import Common from '../../utils/common';

const { width, font } = Common;

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.black75,
  },
  contentWrapper: {
    backgroundColor: Colors.white,
    paddingHorizontal: width.res15,
    paddingVertical: width.res25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: width.res20,
    height: width.res20,
    marginRight: width.res10,
  },
  bigText: {
    fontSize: font.res18,
    fontWeight: '500',
    color: Colors.black,
  },
  text: {
    fontSize: font.res12,
    color: Colors.black,
  },
  greyText: {
    fontSize: font.res12,
    fontWeight: '500',
    color: Colors.brownGrey2,
  },
  whiteText: {
    fontSize: font.res12,
    color: Colors.white,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    height: width.res40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blackButton: {
    backgroundColor: Colors.black,
  },
  orangeButton: {
    backgroundColor: Colors.brightOrange,
  },
  gutter15: {
    marginRight: width.res15,
  },
  mt10: {
    marginTop: width.res10,
  },
});
