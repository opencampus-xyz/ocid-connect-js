import { AirService } from "@mocanetwork/airkit";

let _airService = null;
let _airServiceInitialized = false;

class WalletServiceManager {
  constructor({
    airKitPartnerId,
    airKitEnv,
    airKitTokenEndpoint,
    authInfoManager,
    useAirService,
  }) {
    this.airKitTokenEndpoint = airKitTokenEndpoint;
    this.airKitEnv = airKitEnv;
    this.authInfoManager = authInfoManager;
    if (useAirService && !_airService) {
      _airService = new AirService({
        partnerId: airKitPartnerId,
        environment: airKitEnv,
      });
    }
  }

  async init() {
    if (_airService && !_airServiceInitialized) {
      await _airService.init({
        buildEnv: this.airKitEnv,
      });

      _airServiceInitialized = true;
    }
  }

  async login(accessToken) {
    if(_airService && _airServiceInitialized) {
      await this.init();
      const response = await fetch(this.airKitTokenEndpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tokenResponse = await response.json();
      const { airKitToken } = tokenResponse;

      if (airKitToken) {
        await _airService.login({ authToken: airKitToken });
        this.authInfoManager.updateAuthState({ walletService: _airService });
      }
    }
  }

  async logout() {
    if (_airService && _airService.isLoggedIn) {
      await _airService.logout();
      this.authInfoManager.updateAuthState({ walletService: undefined });
    }
  }
}

export default WalletServiceManager;
