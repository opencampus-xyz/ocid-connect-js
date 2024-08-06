/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


import { stringToBuffer, base64UrlDecode } from './base64';
import { webcrypto, atob } from './webcrypto';

const prepareKey = key =>
{
    const binaryDerString = atob( key );
    return stringToBuffer( binaryDerString );
};

export const verifyToken = async ( idToken, key ) => 
{
    var format = 'spki';
    var algo = {
        name: 'ECDSA',
        namedCurve: 'P-256',
        hash: { name: "SHA-256" }
    };
    var extractable = true;
    var usages = [ 'verify' ];
    const preparedKey = prepareKey( key );
    const cryptoKey = await webcrypto.subtle.importKey(
        format,
        preparedKey,
        algo,
        extractable,
        usages
    );

    var jwt = idToken.split( '.' );
    var payload = stringToBuffer( jwt[ 0 ] + '.' + jwt[ 1 ] );
    var b64Signature = base64UrlDecode( jwt[ 2 ] );
    var signature = stringToBuffer( b64Signature );

    return await webcrypto.subtle.verify(
        algo,
        cryptoKey,
        signature,
        payload
    );
}

