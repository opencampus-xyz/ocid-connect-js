/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
// @ts-ignore
import { OCAuthSandbox, OCAuthLive } from '@opencampus/ocid-connect-js';

// client id for live mode
const CLIENT_ID = ''
let sdk = undefined

// load uri from .env file
// let redirectUri = import.meta.env.VITE_AUTH_REDIRECT_URI
export const getSdk = async () => {
  const opts = {
    storageType: 'cookie', // explicit tell sdk to use cookie
    domain: '', // handle by browser by default
    sameSite: false, // ignore same site policy for cookie
    redirectUri: `http://localhost:8081/redirect`,
    emailPlaceholder: 'test@test.com',
  };

  if (typeof sdk === 'undefined') {
    if (CLIENT_ID) {
      // live mode needs client id
      opts.clientId = CLIENT_ID
      sdk = new OCAuthLive(opts)
    } else {
      sdk = new OCAuthSandbox(opts)
    }
  }

  return sdk
}
