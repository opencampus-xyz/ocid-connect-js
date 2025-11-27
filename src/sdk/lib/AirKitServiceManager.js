import { AirService } from '@mocanetwork/airkit';

let airKitClient = null;

class AirKitServiceClient {
  constructor({ airKitPartnerId, airKitEnv, airKitTokenEndpoint, authInfoManager }) {
    this.airKitTokenEndpoint = airKitTokenEndpoint;
    this.airKitEnv = airKitEnv;
    this.airService = new AirService({
      partnerId: airKitPartnerId,
      environment: airKitEnv,
    });
    this.airServiceInitialized = false;
    this.authInfoManager = authInfoManager;
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

  get isLoggedIn() {
    return this.airService.isLoggedIn;
  }

  async login(accessToken) {
    await this.init();
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
      this.authInfoManager.updateAuthState({ isLoggedInAirKit: true });
    }
  }

  async logout() {
    if (this.airService.isLoggedIn) {
      await this.airService.logout();
    }
    this.authInfoManager.updateAuthState({ isLoggedInAirKit: false });
  }
}

class EmptyAirKitServiceClient {
  constructor() {
    console.log('AirKit Service is disabled.');
  }

  get isLoggedIn() {
    return false;
  }

  async init() {
    return;
  }

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

export default {
  getClient(
    airKitPartnerId,
    airKitEnv,
    airKitTokenEndpoint,
    useAirKitService = false,
    authInfoManager
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
        authInfoManager,
      });
      airKitClient = airService;
    }
    return airKitClient;
  },
};
