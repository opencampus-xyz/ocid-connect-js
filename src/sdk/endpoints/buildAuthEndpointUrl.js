/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
export const buildAuthEndpointUrl = ( signInParams, loginEndPoint ) =>
{
    const loginUrl = new URL( loginEndPoint );
    loginUrl.searchParams.append( 'origin_url', window.location.href );
    loginUrl.searchParams.append( 'redirect_uri', signInParams.redirectUri );
    loginUrl.searchParams.append( 'response_type', signInParams.responseType );
    loginUrl.searchParams.append( 'scope', signInParams.scope );

    // pkce params
    loginUrl.searchParams.append( 'code_challenge', signInParams.codeChallenge );
    loginUrl.searchParams.append( 'code_challenge_method', signInParams.codeChallengeMethod );

    // as long as it is defined we will use it
    if ( signInParams.state !== undefined )
    {
        loginUrl.searchParams.append( 'state', signInParams.state );
    }

    // reference data for register workflow
    if ( signInParams.referralCode )
    {
        loginUrl.searchParams.append( 'ref', signInParams.referralCode );
    }

    return loginUrl.href;
};
