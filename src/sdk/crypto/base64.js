/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { atob, btoa } from './webcrypto';

// converts a standard base64-encoded string to a "url/filename safe" variant
export function base64ToBase64Url ( b64 )
{
    return b64.replace( /\+/g, '-' ).replace( /\//g, '_' ).replace( /=+$/, '' );
}

// converts a "url/filename safe" base64 string to a "standard" base64 string
export function base64UrlToBase64 ( b64u )
{
    return b64u.replace( /-/g, '+' ).replace( /_/g, '/' );
}

// converts a string to base64 (url/filename safe variant)
export function stringToBase64Url ( str )
{
    var b64 = btoa( str );

    return base64ToBase64Url( b64 );
}

export function stringToBuffer ( str )
{
    var buffer = new Uint8Array( str.length );
    for ( var i = 0; i < str.length; i++ )
    {
        buffer[ i ] = str.charCodeAt( i );
    }
    return buffer;
}

export function base64UrlDecode ( str )
{
    return atob( base64UrlToBase64( str ) );
}
