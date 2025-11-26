/*!
 * Copyright 2024-Present Animoca Brands Corporation Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import React, { useEffect, useState } from 'react';

import { OCContext } from './OCContext';
import { OCAuthLive, OCAuthSandbox } from '../sdk/auth';

const OCConnect = ({ children, opts, sandboxMode }) => {
    const [ocAuth, setOcAuth] = useState();
    const [OCId, setOCId] = useState();
    const [ethAddress, setEthAddress] = useState();
    const [authState, setAuthState] = useState();
    const [isInitialized, setIsInitialized] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [airServiceSdk, setAirServiceSdk] = useState(null);

    const updateAuthState = authState => {
        setAuthState(authState);
        setOCId(authState.OCId);
        setEthAddress(authState.ethAddress);
    };

    // init sdk
    useEffect(() => {
        const initializeAuthSdk = async () => {
            const authSdk = sandboxMode ? new OCAuthSandbox(opts) : new OCAuthLive(opts);
            updateAuthState(authSdk.getAuthState());
            setOcAuth(authSdk);
            const airService = await authSdk.getAirKitService();
            setAirServiceSdk(airService);
            setIsInitialized(true);
        };
        initializeAuthSdk();
    }, []);

    useEffect(() => {
        if (ocAuth && ocAuth.authInfoManager) {
            // reactively recieve update on the authstate change
            ocAuth.authInfoManager.subscribe(updateAuthState);
            return () => {
                ocAuth.authInfoManager.unsubscribe(updateAuthState);
            };
        }
    }, [ocAuth]);

    return (
        <OCContext.Provider value={{ OCId, ethAddress, ocAuth, authState, authError, isInitialized, setAuthError, airServiceSdk }}>
            {children}
        </OCContext.Provider>
    );
};

export default OCConnect;
