/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import React, { useCallback, useMemo } from 'react';
// @ts-ignore
import { getSdk } from "../sdk";

const Home = () => {
    const authSdk = getSdk()

    const isAuthenticated = useMemo(() => {
        return !!authSdk && !!authSdk.getAuthState() && authSdk.getAuthState()?.isAuthenticated
    }, [authSdk])
    const handleLogin = useCallback(async () => {
        await authSdk.signInWithRedirect( {
            state: 'opencampus',
        });
    }, [])

    return <div>
        {!isAuthenticated ? (
          <button style={{height: 36, width: 120, borderRadius: 6}} onClick={handleLogin}>Login With SDK</button>
        ) : (
          <div>
              <h4>User Info</h4>
              <pre>{JSON.stringify(authSdk.getAuthInfo(), null, 2)}</pre>
          </div>
        )}
    </div>
};

export default Home;
