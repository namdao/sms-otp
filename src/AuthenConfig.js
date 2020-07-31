class AuthenConfig {
  static config = {
    baseURL: '',
    appID: '',
    onOTPSuccess: () => null,
    onOTPError: () => null,
    trackingEvent: () => null,
    indexLayer: 1000,
  };

  static getConfig() {
    return this.config;
  }

  static setConfig(props) {
    this.config = { ...this.config, ...props };
  }
}

export default AuthenConfig;
