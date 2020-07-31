# E-SMS MODULE

E-SMS Modules for mobiles project of LOGIVAN

## Getting Started

### Installing

Dependencies

```
react-native-tab-view
react-native-animatable
react-native-device-info
axios
libphonenumber-js
lodash
prop-types
```

### Usage

| #Property          | #Type    | #Description                                                                                                                                                   |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onOTPSuccess       | function | Callback after successfully submit valid otp passed in data<br><br> data = {<br>phone_number: '+84xxxxxxxxx',<br>otp_token: 'xxxxx', <br>app_id: 'xxxxx' <br>} |
| onOTPError         | function | Callback after fail submitting otp                                                                                                                             |
| appID              | string   | Id for server to identify which app is using e-sms                                                                                                             |
| baseURL            | string   | Specific server url api                                                                                                                                        |
| renderCustomFooter | function | render custom footer of e-sms module (usually for privacy policy link)                                                                                         |

```
import ESMS from 'modules/auth';

setEsmsRef = ref => {
  this.ESms = ref
}

openESms = () => {
  this.ESms.open()
}

closeESms = () => {
  this.ESms.close()
}

onOTPSuccess = (data) => {
  const { phone_number, app_id, otp_token } = data;
  <!-- Go do something with these properties -->
}

onOTPError = error => {
  <!-- Handle error -->
}

<ESMS
  ref={this.setRef}
  onOTPSuccess={() => alert('Success)}
  onOTPError={() => alert('OTP error')}
  appID={Config.LGV_APP_ID}
  baseURL={this.baseURL}
  renderCustomFooter={this.renderPrivacyAndPolicyText}
 />
```
