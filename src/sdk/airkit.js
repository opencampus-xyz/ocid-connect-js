import { AirService } from '@mocanetwork/airkit';
import { setAirServiceFactory } from './lib/WalletServiceManager';

setAirServiceFactory(({ partnerId, environment }) => new AirService({ partnerId, environment }));

export { setAirServiceFactory };
