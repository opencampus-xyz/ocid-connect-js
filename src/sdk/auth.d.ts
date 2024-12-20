declare class OCAuthCore {
    tokenManager: TokenManager;
    authInfoManager: AuthInfoManager;
    transactionManager: TransactionManager;
    redirectUri: string;
    loginEndPoint: string;
    logoutEndPoint: string;
    referralCode: string;

    constructor(loginEndpoint: string, redirectUri: string, transactionManager: TransactionManager, tokenManager: TokenManager, referralCode: string, logoutEndPoint: string);

    clearStorage(): void;
    logout(logoutReturnTo?: string): Promise<void>;
    signInWithRedirect(params: any): Promise<void>;
    handleLoginRedirect(): Promise<any>;
    isAuthenticated(): boolean;
    syncAuthInfo(): void;
    getAuthState(): any;
    getStateParameter(): any;
    getIdToken(): string | null;
    getAccessToken(): string | null;
    getParsedIdToken(): any;
    getParsedAccessToken(): any;
    get OCId(): string | null;
    get ethAddress(): string | null;
}

declare class OCAuthLive extends OCAuthCore {
    constructor(opts?: {
        tokenEndPoint?: string;
        loginEndPoint?: string;
        logoutEndPoint?: string;
        publicKey?: string;
        redirectUri: string;
        referralCode?: string;
    });
}

declare class OCAuthSandbox extends OCAuthCore {
    constructor(opts?: {
        tokenEndPoint?: string;
        loginEndPoint?: string;
        logoutEndPoint?: string;
        publicKey?: string;
        redirectUri: string;
        referralCode?: string;
    });
}

declare class TokenManager {
    private storageManager: any;
    private tokenExpiredAt: number | null;
    private tokenEndPoint: string;
    private publicKey: string;

    constructor(StorageManagerClass: any, tokenEndPoint: string, publicKey: string);

    clear(): void;
    exchangeTokenFromCode(accessCode: string, codeVerifier: string, state?: string | null): Promise<void>;
    getStateParameter(): string | null;
    getIdToken(): string | null;
    getAccessToken(): string | null;
    getExpiredAt(): number | null;
    getPublicKey(): Promise<string>;
    hasExpired(): boolean;
}

declare class TransactionManager {
    private storageManager: any;

    constructor(StorageManagerClass: any);

    clear(): void;
    save(meta: any): void;
    getTransactionMeta(): any;
    hasActiveTransaction(): boolean;
}

declare class AuthInfoManager {
    private _emitter: any;
    private _authState: {
        accessToken: string | null;
        idToken: string | null;
        OCId: string | null;
        ethAddress: string | null;
        isAuthenticated: boolean;
    } | null;

    constructor();

    setAuthState(
        accessToken: string | null,
        idToken: string | null,
        OCId: string | null,
        ethAddress: string | null,
        isAuthenticated: boolean
    ): void;
    getAuthState(): {
        accessToken: string | null;
        idToken: string | null;
        OCId: string | null;
        ethAddress: string | null;
        isAuthenticated: boolean;
    };
    clear(): void;
    subscribe(handler: (authState: any) => void): void;
    unsubscribe(handler: (authState: any) => void): void;
}