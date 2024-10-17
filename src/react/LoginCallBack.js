/*!
 * Copyright 2024-Present Animoca Brands Corporation Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import React, { useEffect } from 'react';

import { useOCAuth } from './OCContext';

let handledRedirect = false;

const LoginCallBack = ({ successCallback, errorCallback, customErrorComponent, customLoadingComponent }) => {
    const { ocAuth, authState, setAuthError } = useOCAuth();

    useEffect(() => {
        const handleLogin = async () => {
            if (ocAuth)
            {
                try
                {
                    await ocAuth.handleLoginRedirect();
                    successCallback();
                } catch (e)
                {
                    setAuthError(e);
                    if (errorCallback)
                    {
                        errorCallback();
                    }
                }
            }
        };
        if (!handledRedirect)
        {
            handleLogin();
        }
    }, [ocAuth]);

    if (authState.error !== undefined && !errorCallback)
    {
        return customErrorComponent ? customErrorComponent : <div>Error Logging in: {authState.error.message}</div>;
    } else
    {
        return customLoadingComponent ? (
            customLoadingComponent
        ) : (
            <div>
                <h3>Loading ......</h3>
            </div>
        );
    }
};

export default LoginCallBack;
