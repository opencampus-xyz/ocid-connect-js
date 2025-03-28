# OCID JS SDK + React Integration Example

Sample app to demonstrate how to use `react` components with `@opencampus/ocid-connect-js` to perform login flow with ocid sdk

## Prerequisites

Before running this sample, you will need the following:
- An OCID Account

## Install
```bash
$ yarn install
```

## Start Development Server

### Basic Start (Sandbox Mode)
```bash
$ yarn dev
```

### Start with Production Mode
```bash
$ yarn dev:live
```

### Passing Client ID

You can pass a client ID when running any of the commands by prefixing with the VITE_CLIENT_ID environment variable:

```bash
# For sandbox mode with client ID
$ VITE_CLIENT_ID=your_client_id_here yarn dev

# For production mode with client ID
$ VITE_CLIENT_ID=your_client_id_here yarn dev:live
```

* In sandbox mode, the client ID should be blank.

### Setting OCID Connect JS Version

You can specify the version of `@opencampus/ocid-connect-js` to use in two ways:

#### Method 1: Using the set-version script directly

```bash
# Set a specific version
$ OCID_VERSION="1.2.6" yarn set-version

# Then run the app
$ yarn dev
```

#### Method 2: Setting environment variable during installation

```bash
# Install with a specific version
$ OCID_VERSION="1.2.6" yarn install

# Using a specific version, with client ID, and running in sandbox mode
$ OCID_VERSION="1.2.6" yarn install && VITE_CLIENT_ID=your_client_id_here yarn dev
```

After changing the version, you need to run `yarn install` to actually install the specified version.

### Checking the Current Version

To see which version of the SDK is currently set in your package.json:

```bash
$ grep "@opencampus/ocid-connect-js" package.json
```

### Using Cross-Env (Windows Compatibility)

For Windows users, you'll need to use cross-env:

```bash
# For sandbox mode with client ID
$ npx cross-env VITE_CLIENT_ID=your_client_id_here yarn dev

# For setting a specific OCID version
$ npx cross-env OCID_VERSION="1.2.6" yarn set-version

# For setting a specific OCID version during installation
$ npx cross-env OCID_VERSION="1.2.6" yarn install
```

## How It Works

The application reads environment variables from Vite's `import.meta.env` object:

- `VITE_SANDBOX_MODE`: When set to "true", the app runs in sandbox mode (default for `yarn dev`)
- `VITE_CLIENT_ID`: When provided, this client ID is passed to the OCID Connect SDK

The `set-version.js` script updates the version of `@opencampus/ocid-connect-js` in the package.json file.

You can see how the runtime variables are used in `src/App.jsx`.
