import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];
const STANDARD_WINDOW = { width: 375, height: 667 };

/**
 *
  Sometimes you don't want to scale everything in a linear manner, that's where moderate scale comes in.
  The cool thing about it is that you can control the resize factor (default is 0.5).
  If normal scale will increase your size by +2X, moderateScale will only increase it by +X, for example:
  ➡️ responsiveWidth(10) = 20
  ➡️ responsiveHeight(10) = 15
  ➡️ responsiveFontSize(10, 0.1) = 11
 * @param {*} size Number
 * @param {*} factor Number : default = 0.5
 */
export const responsiveWidth = size => (shortDimension / STANDARD_WINDOW.width) * size;
export const responsiveHeight = size => (longDimension / STANDARD_WINDOW.height) * size;
export const responsiveFontSize = (size, factor = 0.5) =>
  size + (responsiveWidth(size) - size) * factor;

const Screen = {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
};

export default Screen;
