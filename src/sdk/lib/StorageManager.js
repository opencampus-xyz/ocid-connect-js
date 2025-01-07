/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { InternalError } from "../utils/errors";
import { CookieStorageProvider } from "./CookieStorageProvider";

class SavedObject
{
    storageProvider;
    storageName;

    constructor ( storageProvider, storageName )
    {
        this.storageProvider = storageProvider;
        this.storageName = storageName;
    }

    getItem ( key )
    {
        return this.getStorage()[ key ];
    }

    setItem ( key, value )
    {
        return this.updateStorage( key, value );
    }

    removeItem ( key )
    {
        return this.clearStorage( key );
    }

    getStorage ()
    {
        let storageString = this.storageProvider.getItem( this.storageName );
        storageString = storageString || '{}';
        try
        {
            return JSON.parse( storageString );
        } catch ( e )
        {
            throw new InternalError( 'Unable to parse storage string: ' + this.storageName );
        }
    }

    setStorage ( obj )
    {
        try
        {
            let storageString = obj ? JSON.stringify( obj ) : '{}';
            this.storageProvider.setItem( this.storageName, storageString );
        } catch ( e )
        {
            throw new Error( 'Unable to set storage: ' + this.storageName );
        }
    }

    clearStorage ( key )
    {
        if ( !key )
        {
            // clear all
            this.storageProvider.removeItem( this.storageName );

            return;
        }

        let obj = this.getStorage();
        delete obj[ key ];
        this.setStorage( obj );
    }

    updateStorage ( key, value )
    {
        let obj = this.getStorage();
        obj[ key ] = value;
        this.setStorage( obj );
    }
}

export class BaseStorageManager
{
    storageProvider;
    storageName;
    constructor ( storageName, storageProvider )
    {
        this.storageName = storageName;
        this.storageProvider = storageProvider;
    }

    getStorageObject ()
    {
        return new SavedObject( this.storageProvider, this.storageName );
    }
}

export class LocalStorageManager extends BaseStorageManager
{
    constructor ( storageName )
    {
        super( storageName, window.localStorage );
    }
}

export const getStorageClass = (opts) => {
    // Only cookie support domain based storage
    if (opts.storageType === 'cookie') {
        return class CookieStorageManager extends BaseStorageManager {
            constructor ( storageName ) {
                super( storageName, new CookieStorageProvider(opts) );
            }
        }
    } else { 
        return LocalStorageManager;
    }
}