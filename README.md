
## Table of Contents

- [Setup](#setup)
- [React Integration](#react-integration)
- [Next.js 13+ Integration](#next-js-13+-integration)
- [Javascript Integration](#javascript-integration)
- [License](#license)

## Setup

**yarn**

Install dependencies
```bash
yarn install
```

Compile & build project
```bash
yarn build
```

Keep in mind that, if you are test OCID with localhost, it might not be able to run on Mobile Safari due to this limitation: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto

## React Integration

Properties that can be overriden

Setup Context to hook up state variables and override configuration

```js
import { OCConnect } from '@opencampus/ocid-connect-js';

const opts = {
    redirectUri: 'http://localhost:3001/redirect',
    referralCode: 'PARTNER6'
}

return (
    <div id='app-root'>
        <OCConnect opts={opts} sandboxMode={true}>
            <RouterProvider router={ router } />
        </OCConnect>
    </div>
)
```

OCConnect Property

| Property | Description |
| --- | --- |
| opts | Authentication's properties that can be overriden |
| sandboxMode | Connect to sandbox if it is set, default to live mode |

Opts Property

| Property | Description |
| --- | --- |
| redirectUri | URL to return after the login process is completed |
| referralCode | Unique identifiers assigned to partners for tracking during OCID account's registration. |

Setup LoginCallBack to handle flow's result

```js
import { LoginCallBack } from '@opencampus/ocid-connect-js';

const loginSuccess = () => {}
const loginError = () => {}

<Route path="/redirect"
    element={ <LoginCallBack errorCallback={loginError} successCallback={loginSuccess}  /> }
/>
```

It is possible to customize Loading & Error Page

```js
import { LoginCallBack, useOCAuth } from '@opencampus/ocid-connect-js';

export default function CustomErrorComponent ()
{
    const { authState, ocAuth } = useOCAuth();

    return (
        <div>Error Logging in: { authState.error.message }</div>
    );
}

export default function CustomLoadingComponent ()
{
    return (
        <div>Loading....</div>
    );
}

<Route path="/redirect"
    element={
        <LoginCallBack
            customErrorComponent={CustomErrorComponent}
            customLoadingComponent={CustomLoadingComponent}
            successCallback={loginSuccess} />
    }
/>
```

Use useOCAuth hook to read credentials info

```js
import { useOCAuth } from '@opencampus/ocid-connect-js';

const UserTokenPage = (props) => {
    const { authState, ocAuth } = useOCAuth();

    if (authState.error !== undefined) {
        return <div>Error: {authState.error.message}</div>;
    } else {
        return (
            <div>
                <h4>User Info</h4>
                <pre>
                { JSON.stringify(ocAuth.getAuthInfo(), null, 2) }
                </pre>
            </div>
        );
    }
};
```

## Next Js 13+ Integration

Install dependencies
```bash
npm install @opencampus/ocid-connect-js
```

or

```bash
yarn add @opencampus/ocid-connect-js
```

### 1. Create a wrapper component 

```
components/OCConnectWrapper.jsx
```

```js
'use client'

import { ReactNode } from 'react';
import { OCConnect, OCConnectProps } from '@opencampus/ocid-connect-js';



export default function OCConnectWrapper({ children, opts, sandboxMode }) {
  return (
    <OCConnect opts={opts} sandboxMode={sandboxMode}>
      {children}
    </OCConnect>
  );
}
```


### 2. Update the root layout

```
app/layout.jsx
```

```js
import OCConnectWrapper from '../components/OCConnectWrapper';

export default function RootLayout({
  children,
}) {
  const opts = {
    redirectUri: 'http://localhost:3000/redirect', // Adjust this URL
    referralCode: 'PARTNER6', // Assign partner code
  };

  return (
    <html lang="en">
      <body>
        <OCConnectWrapper opts={opts} sandboxMode={true}>
          {children}
        </OCConnectWrapper>
      </body>
    </html>
  );
}
```

### 3. Create a redirect page

```
app/redirect/page.jsx
```

```js
'use client'

import { LoginCallBack } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const router = useRouter();

  const loginSuccess = () => {
    router.push('/'); // Redirect after successful login
  };

  const loginError = (error) => {
    console.error('Login error:', error);
  };

  function CustomErrorComponent() {
  const { authState } = useOCAuth();
  return <div>Error Logging in: {authState.error?.message}</div>;
  }

  function CustomLoadingComponent() {
  return <div>Loading....</div>;
  }

  return (
    <LoginCallBack 
      errorCallback={loginError} 
      successCallback={loginSuccess}
      customErrorComponent={<CustomErrorComponent />}
      customLoadingComponent={<CustomLoadingComponent />} 
    />
  );
}
```



### 4. Create a LoginButton Component

```
components/LoginButton.jsx
```

```js
'use client'

import { useOCAuth } from '@opencampus/ocid-connect-js';

export default function LoginButton() {
  const { ocAuth } = useOCAuth();

  const handleLogin = async () => {
    try {
      await ocAuth.signInWithRedirect({ state: 'opencampus' });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### 5. Use Components in Your Page

```
app/page.jsx
```

```js

'use client';

import { useEffect } from 'react';
import LoginButton from '../components/LoginButton';
import { useOCAuth } from '@opencampus/ocid-connect-js';

export default function Home() {
  const { authState, ocAuth } = useOCAuth();

  useEffect(() => {
    console.log(authState);
  }, [authState]); // Now it will log whenever authState changes

  if (authState.error) {
    return <div>Error: {authState.error.message}</div>;
  }

  // Add a loading state
  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to My App</h1>
      {authState.isAuthenticated ? (
        <p>You are logged in! {JSON.stringify(ocAuth.getAuthInfo())}</p>
        
      ) : (
        <LoginButton />
      )}
    </div>
  );
}

```


## Javascript Integration
If React is not desirable front end framework, Our sdk could be used to integrate seamlessly with others.

Our authentication flow adhere to OIDC Auth Code Flow + PKCE standard.

First and foremost, we could initialize the SDK to use either OCAuthSandbox (testing environment) and OCAuthLive (production environment)

```js
import { OCAuthSandbox } from '@opencampus/ocid-connect-js';
const authSdk = new OCAuthSandbox();
```

Main Methods of Auth SDK

| Method | Description |
| --- | --- |
| signInWithRedirect | Initialize login process. Accept "state" as an input |
| handleLoginRedirect | Return the auth state of the login process |
| getAuthInfo | Return auth object { edu_username, eth_address } |
| getAuthState | Return auth state data { accessToken, idToken, isAuthenticated } |

Sample usage

```js
import { OCAuthSandbox } from '@opencampus/ocid-connect-js';

const authSdk = new OCAuthSandbox()
await authSdk.signInWithRedirect( {
    state: 'opencampus',
});
```

The login flow adhere with PKCE standard. The following params will be prepared by our SDK and send to authentication server.

| Method | Description |
| --- | --- |
| origin_url | Origin of the authentication request |
| redirect_uri | Desitnation after the authentication is completed |
| response_type | 'code' is being used to adhere with PKCE standard  |
| scope | only support 'openid' at the moment |
| code_challenge | adhere with PKCE standard |
| code_challenge_method | Only S256 is supported at the moment |
| ref | Unique identifiers assigned to partners for tracking during user registration |

Sample usage to handle login response

```js
try {
    const authState = await ocAuth.handleLoginRedirect();
    if ( authState.idToken ) {
        // login process is completed
    } else {
        // login process is not completed
    }
} catch ( e ) {
    // there is an exception during login process
}
```

### License
ocid-connect-js is released under the MIT license.
