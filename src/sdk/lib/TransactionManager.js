/*!
* Copyright 2024-Present Animoca Brands Corporation Ltd. 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


// TransactionManager manages data that's stored over a "transaction"
// of the login cycle
// A transaction contains a few things that we want to carry over multiple
// times interacting with the SDK
// Currently just used for
// codeChallenge, codeVerifier, codeChallengeMethod

const TRANSACTION_STORAGE_NAME = 'oc-transaction-storage';

class TransactionManager
{
    storageManager;

    constructor ( StorageManagerClass )
    {
        this.storageManager = new StorageManagerClass( TRANSACTION_STORAGE_NAME );
    }

    // called when we start a new transaction
    clear ()
    {
        this.storageManager.getStorageObject().clearStorage();
    }

    save ( meta )
    {
        this.storageManager.getStorageObject().setStorage( meta );
    }

    getTransactionMeta ()
    {
        return this.storageManager.getStorageObject().getStorage();
    }

    hasActiveTransaction ()
    {
        const meta = this.storageManager.getStorageObject();

        return !!meta.codeChallenge && !!meta.codeVerifier;
    }
}

export default TransactionManager;
