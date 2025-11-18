import { AirService } from '@mocanetwork/airkit';

class AirKitServiceManager {
  constructor(
    airKitPartnerId,
    airKitEnv,
    airKitTokenEndpoint,
    useAirKitService = false
  ) {
    this.airKitPartnerId = airKitPartnerId;
    this.airKitInstance = null;
    this.airKitEnv = airKitEnv;
    this.airKitTokenEndpoint = airKitTokenEndpoint;
    this.useAirKitService = useAirKitService;
  }

  async getInstance() {
    if (!this.airKitInstance) {
      if (!this.useAirKitService) {
        this.airKitInstance = new EmptyAirKitServiceManager();
        return this.airKitInstance;
      }
      const airService = new AirService({
        partnerId: this.airKitPartnerId,
        environment: this.airKitEnv,
      });
      await airService.init({
        buildEnv: this.airKitEnv,
      });
      this.airKitInstance = airService;
    }
    return this.airKitInstance;
  }

  async login(accessToken) {
    const response = await fetch(this.airKitTokenEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const tokenResponse = await response.json();
    const { airKitToken } = tokenResponse;
    if (airKitToken) {
      const airService = await this.getInstance();
      await airService.login({ authToken: airKitToken });
    }
  }

  async logout() {
    const airService = await this.getInstance();
    if (airService.isLoggedIn) {
      await airService.logout();
    }
  }
}

class EmptyAirKitServiceManager {
  constructor() {
    console.log('AirKit Service is disabled.');
  }
  getUserDetails() {}
  async getInstance() {
    return null;
  }
  async login() {
    return;
  }
  async logout() {
    return;
  }
}

export default AirKitServiceManager;
