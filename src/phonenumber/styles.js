import { StyleSheet } from 'react-native';
import Colors from '../utils/colors';
import Common from '../utils/common';

const { width } = Common;

export default StyleSheet.create({
  wrapPhoneNumber: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: width.res15,
  },
  ContainerHeader: {},
  title: {
    color: Colors.black,
    fontSize: Common.font.res16,
    letterSpacing: 0.2,
    fontWeight: 'bold',
  },
  subTitle: {
    color: Colors.black,
    fontSize: Common.font.res11,
    letterSpacing: 0.2,
    lineHeight: Common.font.res15,
    paddingVertical: width.res10,
  },
  flag: {
    width: width.res24,
    height: width.res24,
    marginHorizontal: width.res3,
  },
  nationalStyle: {
    paddingHorizontal: width.res10,
    color: Colors.black,
    fontSize: Common.font.res14,
  },
  containerPhoneNumber: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: width.res10,
    backgroundColor: Colors.input.lightGrey,
    alignItems: 'center',
  },
  inputPhoneNumber: {
    flex: 1,
    paddingHorizontal: width.res5,
    paddingVertical: 0,
    color: Colors.black,
  },
  buttonNext: {
    backgroundColor: Colors.brightOrange,
    justifyContent: 'center',
    padding: width.res10,
    marginVertical: width.res15,
    alignItems: 'center',
    borderRadius: width.res2,
    shadowColor: Colors.polo_blue,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: width.res1,
  },
  textButton: {
    color: Colors.white,
    fontSize: Common.font.res14,
  },
  highlighText: {
    color: Colors.main,
  },
  textBottom: {
    color: Colors.brownGrey2,
    fontSize: Common.font.res12,
    paddingVertical: Common.font.res2,
  },
  wrappFooter: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.red,
    fontSize: Common.font.res12,
    marginTop: width.res6,
    letterSpacing: 0.2,
    lineHeight: width.res16,
  },
});
