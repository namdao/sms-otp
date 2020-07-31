import { StyleSheet } from 'react-native';
import Common from '../utils/common';
import Colors from '../utils/colors';

const { width, font } = Common;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: width.res15,
  },
  otpInputContainer: {
    alignSelf: 'center',
    width: width.res255,
    height: width.res45,
    marginTop: width.res25,
  },
  input: {
    width: width.res45,
    height: width.res45,
    borderWidth: 0,
    borderBottomWidth: width.res1,
    borderColor: Colors.black,
    borderRadius: 0,
    fontSize: font.res22,
    color: Colors.black,
  },
  inputEmpty: {
    borderColor: Colors.paleBlue,
  },
  submitButton: {
    backgroundColor: Colors.brightOrange,
    width: width.res315,
    height: width.res40,
    alignSelf: 'center',
    borderRadius: width.res2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendButton: {
    alignSelf: 'center',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  mt15: {
    marginTop: 15,
  },
  mb10: {
    marginBottom: width.res10,
  },
  title: {
    fontSize: font.res16,
    color: Colors.black,
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
    color: Colors.black,
  },
  text: {
    fontSize: font.res12,
    color: Colors.black,
  },
  whiteText: {
    fontSize: font.res12,
    color: Colors.white,
    fontWeight: 'bold',
  },
  orangeText: {
    fontSize: font.res12,
    color: Colors.brightOrange,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: Colors.red,
    color: Colors.red,
  },
  errorText: {
    fontSize: font.res12,
    color: Colors.red,
    textAlign: 'center',
    paddingTop: width.res10,
  },
});
