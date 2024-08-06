/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/* eslint-disable complexity, max-statements */

import { stringToBase64Url, webcrypto } from '../crypto';

export const MIN_VERIFIER_LENGTH = 43;
export const MAX_VERIFIER_LENGTH = 128;
export const DEFAULT_CODE_CHALLENGE_METHOD = 'S256';

function dec2hex ( dec )
{
    return ( '0' + dec.toString( 16 ) ).substr( -2 );
}

function getRandomString ( length )
{
    var a = new Uint8Array( Math.ceil( length / 2 ) );
    webcrypto.getRandomValues( a );
    var str = Array.from( a, dec2hex ).join( '' );

    return str.slice( 0, length );
}

function generateVerifier ( prefix )
{
    var verifier = prefix || '';
    if ( verifier.length < MIN_VERIFIER_LENGTH )
    {
        verifier = verifier + getRandomString( MIN_VERIFIER_LENGTH - verifier.length );
    }

    return encodeURIComponent( verifier ).slice( 0, MAX_VERIFIER_LENGTH );
}

function computeChallenge ( str )
{
    var buffer = new TextEncoder().encode( str );

    return webcrypto.subtle.digest( 'SHA-256', buffer ).then( function ( arrayBuffer )
    {
        var hash = String.fromCharCode.apply( null, new Uint8Array( arrayBuffer ) );
        var b64u = stringToBase64Url( hash ); // url-safe base64 variant

        return b64u;
    } );
}

export default {
    DEFAULT_CODE_CHALLENGE_METHOD,
    generateVerifier,
    computeChallenge,
};
