/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import Cookies from 'js-cookie';

export class CookieStorageProvider {
    domain;
    sameSite;

    constructor(options = {}) {
        this.domain = options.domain;
        this.sameSite = options.sameSite;
    }

    getItem(key) {
        return Cookies.get(key);
    }

    setItem(key, value) {
        const cookieOptions = { 
            expires: 365, 
            path: '/', 
            domain: this.domain
        };
        
        if (this.sameSite === true) {
            cookieOptions.sameSite = 'Strict';
        } else if (this.sameSite === false) {
            cookieOptions.sameSite = 'None';
            cookieOptions.secure = true;
        }

        // if sameSite is undefined or null, leave default browser behavior
        return Cookies.set(key, value, cookieOptions);
    }

    removeItem(key) {
        return Cookies.remove(key, { path: '/', domain: this.domain });
    }
}
