/*!
 * Copyright 2024-Present Animoca Brands Corporation Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import AuthInfoManager from './lib/AuthInfoManager';
import TokenManager from './lib/TokenManager';
import TransactionManager from './lib/TransactionManager';
import { getStorageClass } from './lib/StorageManager';
import { createPkceMeta, parseJwt, parseUrl, prepareTokenParams } from './utils';
import { buildAuthEndpointUrl } from './endpoints';
import { AuthError, InvalidParamsError } from './utils/errors';
import { BUILD_ENV } from '@mocanetwork/airkit';
import AirKitServiceManager from './lib/AirKitServiceManager';

export class OCAuthCore {
    clientId;
    tokenManager;
    authInfoManager;
    transactionManager;
    redirectUri;
    loginEndPoint;
    logoutEndPoint;
    referralCode;
    airKitServiceManager;

    constructor(clientId, loginEndpoint, redirectUri, transactionManager, tokenManager, referralCode, logoutEndPoint, airKitServiceManager) {
        this.transactionManager = transactionManager;
        this.tokenManager = tokenManager;
        this.authInfoManager = new AuthInfoManager();
        this.loginEndPoint = loginEndpoint;
        this.logoutEndPoint = logoutEndPoint;
        this.redirectUri = redirectUri;
        this.referralCode = referralCode;
        this.clientId = clientId;
        this.airKitServiceManager = airKitServiceManager;
        this.syncAuthInfo();
    }

    static async initialize(clientId, loginEndpoint, redirectUri, transactionManager, tokenManager, referralCode, logoutEndPoint, airKitServiceManager) {
        if (!clientId) {
            throw new InvalidParamsError('clientId is not defined');
        }
        if(!tokenManager.hasExpired()){
            const accessToken = tokenManager.getAccessToken();
            await airKitServiceManager.login(accessToken);
        }
        return new this(clientId, loginEndpoint, redirectUri, transactionManager, tokenManager, referralCode, logoutEndPoint, airKitServiceManager);
    }

    async syncAirKitInfo(){
        await this.airKitServiceManager.login(this.getAccessToken());
    }

    clearStorage() {
        this.transactionManager.clear();
        this.tokenManager.clear();
    }

    async logout(logoutReturnTo) {
        this.clearStorage();
        await this.airKitServiceManager.logout();
        const url = new URL(this.logoutEndPoint);
        if (logoutReturnTo) {
            url.searchParams.append('returnTo', logoutReturnTo);
        }
        window.location.assign(url.toString());
    }

    async signInWithRedirect(params) {
        // we use ONLY code flow with PKCE, so lacks a lot of options
        // available in other OAuth SDKs.
        const paramsClone = Object.assign({}, params);
        paramsClone.redirectUri = this.redirectUri;
        paramsClone.clientId = this.clientId;
        const signinParams = await prepareTokenParams(paramsClone);
        const meta = createPkceMeta(signinParams);
        this.transactionManager.save(meta);
        signinParams.referralCode = this.referralCode;
        signinParams.emailPlaceholder = paramsClone.emailPlaceholder;
        const requestUrl = buildAuthEndpointUrl(signinParams, this.loginEndPoint);
        window.location.assign(requestUrl);
    }

    async handleLoginRedirect() {
        const urlParams = parseUrl();
        // Again we only handle PKCE code flow
        if (urlParams.code) {
            const meta = this.transactionManager.getTransactionMeta();
            const { codeVerifier } = meta;
            if (codeVerifier) {
                // we used pkce mode, use it
                await this.tokenManager.exchangeTokenFromCode(urlParams.code, codeVerifier, urlParams.state);
                // clear transaction meta, coz it's completed
                this.transactionManager.clear();
                this.syncAuthInfo();
                await this.syncAirKitInfo();
                return this.getAuthState();
            } else {
                throw new AuthError('codeVerifier not found, cannot complete flow');
            }
        }

        // no code found, nothing to do
        return {};
    }

    getAirKitService() {
        return this.airKitServiceManager.getInstance();
    }

    isAuthenticated() {
        // if both token exist and not expired
        return !this.tokenManager.hasExpired();
    }

    syncAuthInfo() {
        if (this.tokenManager.hasExpired()) {
            this.authInfoManager.clear();
        } else {
            const { edu_username, eth_address } = this.getParsedIdToken();
            this.authInfoManager.setAuthState(
                this.getAccessToken(),
                this.getIdToken(),
                edu_username,
                eth_address,
                true
            );
        }
    }

    getAuthState() {
        return this.authInfoManager.getAuthState();
    }

    getStateParameter() {
        return this.tokenManager.getStateParameter();
    }

    getIdToken() {
        return this.tokenManager.getIdToken();
    }

    getAccessToken() {
        return this.tokenManager.getAccessToken();
    }

    getParsedIdToken() {
        // return all info in id token
        const idToken = this.tokenManager.getIdToken();
        if (idToken) {
            return parseJwt(idToken);
        }
        return {};
    }

    getParsedAccessToken() {
        // return all info in access token
        const accessToken = this.tokenManager.getAccessToken();
        if (accessToken) {
            return parseJwt(accessToken);
        }
        return {};
    }

    get OCId() {
        const info = this.authInfoManager.getAuthState();
        return info.OCId ?? null;
    }

    get ethAddress() {
        const info = this.authInfoManager.getAuthState();
        return info.ethAddress ?? null;
    }
}

const LIVE_PUBLIC_KEY =
    'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEBIDHtLbgVM76SXZ4iuIjuO+ERQPnVpJzagOsZdYxFG3ZJmvfdpr/Z29SLUbdZWafrOlAVlKe1Ovf/tcH671tTw==';
const SANDBOX_PUBLIC_KEY =
    'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE/EymMLXd/MVYPK5r2xXQj91ZVvX3OQ+QagvR2N6lCvRVjnzmOtPRTf+u5g1RliWnmuxbV3gTm0/0VuV/40Salg==';
const LIVE_PARTNER_ID = '961d2601-5671-4cc5-9618-6bee02864878';
const SANDBOX_PARTNER_ID = '961d2601-5671-4cc5-9618-6bee02864878';
export class OCAuthLive extends OCAuthCore {
    constructor(clientId, loginEndpoint, redirectUri, pkceTransactionManager, tokenManager, referralCode, logoutEndpoint, airKitServiceManager) {
        super(clientId, loginEndpoint, redirectUri, pkceTransactionManager, tokenManager, referralCode, logoutEndpoint, airKitServiceManager);
    }

    static async initialize(opts = {}) {
        const {
            tokenEndPoint: overrideTokenEndpoint,
            loginEndPoint: overrideLoginEndpoint,
            logoutEndPoint: overrideLogoutEndpoint,
            publicKey: overridePublicKey,
            airKitTokenEndPoint: overrideAirKitTokenEndpoint,
            redirectUri,
            referralCode,
            clientId,
        } = opts;
        const tokenEndpoint = overrideTokenEndpoint || 'https://api.login.opencampus.xyz/auth/token';
        const loginEndpoint = overrideLoginEndpoint || 'https://api.login.opencampus.xyz/auth/login';
        const logoutEndpoint = overrideLogoutEndpoint || 'https://api.login.opencampus.xyz/auth/logout';
        const airKitTokenEndpoint = overrideAirKitTokenEndpoint || 'https://api.login.opencampus.xyz/auth/airkit/token';
        const publicKey = overridePublicKey || LIVE_PUBLIC_KEY;
        const airKitPartnerId = LIVE_PARTNER_ID;

        const storageClass = getStorageClass(opts);
        const airKitServiceManager = new AirKitServiceManager(airKitPartnerId, BUILD_ENV.STAGING, airKitTokenEndpoint);
        const pkceTransactionManager = new TransactionManager(storageClass);
        const tokenManager = new TokenManager(storageClass, tokenEndpoint, publicKey);
        await super.initialize(clientId, loginEndpoint, redirectUri, pkceTransactionManager, tokenManager, referralCode, logoutEndpoint, airKitServiceManager);
        return new OCAuthLive(clientId, loginEndpoint, redirectUri, pkceTransactionManager, tokenManager, referralCode, logoutEndpoint, airKitServiceManager);
    }
}

export class OCAuthSandbox extends OCAuthCore {
    constructor(clientId, loginEndpoint, redirectUri, pkceTransactionManager, tokenManager, referralCode, logoutEndpoint, airKitServiceManager) {
        super(clientId, loginEndpoint, redirectUri, pkceTransactionManager, tokenManager, referralCode, logoutEndpoint, airKitServiceManager);
    }
    static async initialize(opts = {}) {
                        const {
            tokenEndPoint: overrideTokenEndpoint,
            loginEndPoint: overrideLoginEndpoint,
            logoutEndPoint: overrideLogoutEndpoint,
            airKitTokenEndPoint: overrideAirKitTokenEndpoint,
            publicKey: overridePublicKey,
            redirectUri,
            referralCode,
        } = opts;
        const clientId = opts.clientId || 'sandbox';
        const tokenEndpoint = overrideTokenEndpoint || 'https://api.login.sandbox.opencampus.xyz/auth/token';
        const loginEndpoint = overrideLoginEndpoint || 'https://api.login.sandbox.opencampus.xyz/auth/login';
        const logoutEndpoint = overrideLogoutEndpoint || 'https://api.login.sandbox.opencampus.xyz/auth/logout';
        const airKitTokenEndpoint = overrideAirKitTokenEndpoint || 'https://api.login.sandbox.opencampus.xyz/auth/airkit/token';
        const publicKey = overridePublicKey || SANDBOX_PUBLIC_KEY;
        const airKitPartnerId = SANDBOX_PARTNER_ID;

        const storageClass = getStorageClass(opts);
        const airKitServiceManager = new AirKitServiceManager(airKitPartnerId, BUILD_ENV.STAGING, airKitTokenEndpoint);
        const pkceTransactionManager = new TransactionManager(storageClass);
        const tokenManager = new TokenManager(storageClass, tokenEndpoint, publicKey);
        await super.initialize(clientId, loginEndpoint, redirectUri, pkceTransactionManager, tokenManager, referralCode, logoutEndpoint, airKitServiceManager);
        return new OCAuthSandbox(clientId, loginEndpoint, redirectUri, pkceTransactionManager, tokenManager, referralCode, logoutEndpoint, airKitServiceManager);
 }


}
