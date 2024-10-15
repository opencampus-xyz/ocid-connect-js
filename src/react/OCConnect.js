/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import React, { useEffect, useState, useMemo } from 'react';

import { OCContext } from './OCContext';
import { OCAuthLive, OCAuthSandbox } from '../sdk/auth';

const OCConnect = ( { children, opts, sandboxMode } ) =>
{
    const [ ocAuth, setOcAuth ] = useState( {} );
    const [ OCId, setOCId ] = useState(null);
    const [ ethAddress, setEthAddress ] = useState(null);
    const [ authState, setAuthState ] = useState( {
        isAuthenticated: false,
    } );

    const isAuthenticated = useMemo(() => {
        if (typeof ocAuth.isAuthenticated === 'function')
        {
            return ocAuth.isAuthenticated();
        }
        return false;
    }, [ocAuth, authState]);

    // init sdk
    useEffect( () =>
    {
        const authSdk = sandboxMode ? new OCAuthSandbox( opts ) : new OCAuthLive( opts );
        setOcAuth( authSdk );
    }, [] );

    // wait until authSdk is initialized
    useEffect(() => {
        if (isAuthenticated)
        {
            updateAuthState();
        }
    }, [isAuthenticated]);

    const updateAuthState = () =>
    {
        const { accessToken, idToken, isAuthenticated } = ocAuth.getAuthState();
        if (isAuthenticated)
        {
            setAuthState( {
                accessToken,
                idToken,
                isAuthenticated,
            } );
            setOCId(ocAuth.OCId)
            setEthAddress(ocAuth.ethAddress)
        }
    };

    const updateAuthError = (error) =>
    {
        setAuthState({ error });
    };
    
    return <OCContext.Provider value={ { OCId, ethAddress, ocAuth, authState, updateAuthState, updateAuthError } }>{ children }</OCContext.Provider>;
};

export default OCConnect;
