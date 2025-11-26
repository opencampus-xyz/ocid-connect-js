/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Emitter from 'tiny-emitter';

const EVENT_AUTH_STATE_CHANGE = 'authStateChange';

class AuthInfoManager
{
    _emmitter;
    _authState;

    constructor ()
    {
        this._authState = null;
        this._emitter = new Emitter();
    }

    setAuthState (accessToken, idToken, OCId, ethAddress, isAuthenticated)
    {
        this._authState = { accessToken, idToken, OCId, ethAddress, isAuthenticated, isLoggedInAirKit: false };
        this._emitter.emit(EVENT_AUTH_STATE_CHANGE, this._authState);
    }

    getAuthState ()
    {
        return Object.assign({}, this._authState);
    }

    updateAuthState (partialAuthState)
    {
        this._authState = Object.assign({}, this._authState, partialAuthState);
        this._emitter.emit(EVENT_AUTH_STATE_CHANGE, this._authState);
    }

    clear ()
    {
        this._authState = { isAuthenticated: false };
        this._emitter.emit(EVENT_AUTH_STATE_CHANGE, this._authState);
    }

    subscribe (handler)
    {
        this._emitter.on(EVENT_AUTH_STATE_CHANGE, handler);
    }

    unsubscribe (handler)
    {
        this._emitter.off(EVENT_AUTH_STATE_CHANGE, handler);
    }
}

export default AuthInfoManager;
