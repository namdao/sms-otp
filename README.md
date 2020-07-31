
# emobile-sms-otp-react-native

## Getting started

`$ npm install namdao/sms-otp`

## rn > 0.60 autolink
## rn < 0.60:

### Mostly automatic installation

`$ react-native link namdao/sms-otp `

### Manual installation

#### iOS

don't need

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.logivanotp.@logivan/mobile-sms-otp;` to the imports at the top of the file
  - Add `new RNLogivanMobileSmsOtpPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':@logivan/mobile-sms-otp'
  	project(':@logivan/mobile-sms-otp').projectDir = new File(rootProject.projectDir, 	'../node_modules/@logivan/mobile-sms-otp/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':@logivan/mobile-sms-otp')
  	```


#### Usage



| #Property          | #Type    | #Description                                                                                                                                                   |
| ------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onOTPSuccess       | function | Callback after successfully submit valid otp passed in data<br><br> data = {<br>phone_number: '+84xxxxxxxxx',<br>otp_token: 'xxxxx', <br>app_id: 'xxxxx' <br>} |
| onOTPError         | function | Callback after fail submitting otp                                                                                                                             |
| appID              | string   | Id for server to identify which app is using e-sms                                                                                                             |
| baseURL            | string   | Specific server url api                                                                                                                                        |
| renderCustomFooter | function | render custom footer of e-sms module (usually for privacy policy link)                                                                                         |

```javascript
import { OTP } from 'sms-otp';

setOTPRef = ref => {
  this.Otp = ref
}

openOTP = () => {
  this.Otp.open()
}

closeOTP = () => {
  this.Otp.close()
}

onOTPSuccess = (data) => {
  const { phone_number, app_id, otp_token } = data;
  <!-- Go do something with these properties -->
}

onOTPError = error => {
  <!-- Handle error -->
}
renderPrivacyAndPolicyText = () => {
	  <!-- render Footer if need -->
}

<OTP
  ref={this.setRef}
  onOTPSuccess={this.onOTPSuccess}
  onOTPError={this.onOTPError}
  appID="Example appID"
  baseURL="Example baseURL"
  renderCustomFooter={this.renderPrivacyAndPolicyText}
 />
```


### Auto fill OTP code from message

#### Ios
- This features **works on (Xcode 10 or above) and in (iOS 12 or above)**
- Message should contain **passcode** or code **keyword** (**Ma xac minh** in vietnamese).

#### Android
You will registering broadcast receiver in AndroidManifest.xml.
 
```xml
 <application
 ...
 >
  ...
  <receiver android:name="com.logivanotp.RNSmsRetrieverBroadcastReciever" 
        android:exported="true">
    <intent-filter>
      <action android:name="com.google.android.gms.auth.api.phone.SMS_RETRIEVED"/>
    </intent-filter>
  </receiver>
  ...
</application>
```
This message must :
- Be no longer than 140 bytes
- Begin with the prefix <#>
- Contain a one-time code that the client sends back to your server to complete the verification flow (see Generating a one-time code)
- End with an 11-character hash string that identifies your app (see [Computing your app’s hash string](https://developers.google.com/identity/sms-retriever/verify#computing_your_apps_hash_string)).

Your message should look like this: 

><#> Your ExampleApp code is: 123ABC78\
FA+9qCX9VSu

You can generate an 11-character hash string in two ways:
1. Using the below command:

>keytool -exportcert -alias MyAndroidKey -keystore MyProductionKeys.keystore | xxd -p | tr -d "[:space:]" | echo -n com.example.myapp `cat` | sha256sum | tr -d "[:space:]-" | xxd -r -p | base64 | cut -c1-11

replace “MyAndroidKey”, ”MyProductionKeys.keystore” and “com.example.myapp” with your android key, keystore, and package name respectively.

2. Using method **getHash** of library

```javascript
import { RNLogivanMobileSmsOtp } from '@logivan/mobile-sms-otp';
const hash = await RNLogivanMobileSmsOtp.getHash();
```
