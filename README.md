
## Table of Contents

- [Setup](#setup)
- [React Integration](#react-integration)
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
