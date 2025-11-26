import { AirService } from '@mocanetwork/airkit';

let airKitClient = null;

class AirKitServiceClient {
  constructor({ airKitPartnerId, airKitEnv, airKitTokenEndpoint }) {
    this.airKitTokenEndpoint = airKitTokenEndpoint;
    this.airKitEnv = airKitEnv;
    this.airService = new AirService({
      partnerId: airKitPartnerId,
      environment: airKitEnv,
    });
    this.airServiceInitialized = false;
  }

  async init() {
    if (!this.airServiceInitialized) {
      await this.airService.init({
        buildEnv: this.airKitEnv,
      });

      this.airServiceInitialized = true;
    }
  }

  getInstance() {
    if (!this.airServiceInitialized) {
      console.log('AirService is initializing');
    }
    return this.airService;
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
      await this.airService.login({ authToken: airKitToken });
    }
  }

  async logout() {
    if (this.airService.isLoggedIn) {
      await this.airService.logout();
    }
  }
}

class EmptyAirKitServiceClient {
  constructor() {
    console.log('AirKit Service is disabled.');
  }

  async init() {
    return;
  }

  async getInstance() {
    return null;
  }

  getUserDetails() {}

  async login() {
    return;
  }
  async logout() {
    return;
  }
}

export default {
  getClient(
    airKitPartnerId,
    airKitEnv,
    airKitTokenEndpoint,
    useAirKitService = false
  ) {
    if (!airKitClient) {
      if (!useAirKitService) {
        airKitClient = new EmptyAirKitServiceClient();
        return airKitClient;
      }
      const airService = new AirKitServiceClient({
        airKitPartnerId,
        airKitEnv,
        airKitTokenEndpoint,
      });
      airKitClient = airService;
    }
    return airKitClient;
  },
};
