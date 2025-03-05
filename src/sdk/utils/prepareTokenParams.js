/*!
 * Copyright 2024-Present Animoca Brands Corporation Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import PKCE from '../lib/pkce';
import { InvalidParamsError } from './errors';

export const prepareTokenParams = async params => {
    // prepare all the params needed for building the signin flow
    // mandatory redirect_uri, for now, we only allow user to set redirect_uri and state
    // again this is not a full on OIDC/OAuth flow allowing user to set all the options
    // we prepare all the rest
    const { clientId, redirectUri, state } = params;

    if (!redirectUri) {
        throw new InvalidParamsError(' No redirect uri params!');
    }

    // must be pkce
    const codeVerifier = PKCE.generateVerifier();
    const codeChallenge = await PKCE.computeChallenge(codeVerifier);

    // pack up the full set of token params needed
    const tokenParams = {
        clientId,
        redirectUri,
        codeVerifier,
        codeChallenge,
        codeChallengeMethod: PKCE.DEFAULT_CODE_CHALLENGE_METHOD,
        scope: 'openid',
        responseType: 'code',
    };

    // just filter out undefined and null, honor other falsy states
    if (state !== undefined && state !== null) {
        tokenParams.state = state;
    }

    return tokenParams;
};
