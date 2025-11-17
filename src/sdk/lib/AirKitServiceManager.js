import { AirService } from '@mocanetwork/airkit';

class AirKitServiceManager {
  constructor(airKitPartnerId, airKitEnv, airKitTokenEndpoint) {
    this.airKitPartnerId = airKitPartnerId;
    this.airKitInstance = null;
    this.airKitEnv = airKitEnv;
    this.airKitTokenEndpoint = airKitTokenEndpoint;
  }

  async getInstance() {
    if (!this.airKitInstance) {
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

export default AirKitServiceManager;
